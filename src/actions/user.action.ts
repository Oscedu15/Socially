"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//Funcion para sincronizar al usuario registrado en clerck con la base de datos
export async function syncUser() {
  try {
    const { userId } = await auth();
    // console.log("soy userId", userId); //soy userId user_2s51MQ6X96VLysFjyzSFSVmpHVQ
    const user = await currentUser();
    // console.log("Soy User", user); //Lo mismo que usrId pero con un objeto con mas propiedades

    if (!userId || !user) return;

    //!Si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    //Retornamos el usuario
    if (existingUser) return existingUser;

    //!Si es primera vez que ingresa el usuario, lo creamos.
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}

//Todo: Funcion para obtener la informacion desde la base de datos, a mostrar en el sidebar
//Recibira como parametro el id del usuario desde clerk
export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    //Hara una busqueda unica en la base de datos, donde coincida el id
    where: {
      clerkId,
    },
    //Y que incuya los seguidores, posts, etc en un objeto(count)
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

//TODO: Funcion para obtener el id del usuario en la base de datos
export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  //Recibimos el id que nos da clerck, sino existe arrojamos un null
  if (!clerkId) return null;

  //Si existe, pasamos el id a la funcion para buscar en la base de datos las propiedades del usuario
  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
}

//TODO: Funcion para obtener aslgunos usuarios al azar
export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();

    if (!userId) return [];

    // get 3 random users exclude ourselves & users that we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          //Aqui le aclaramos que los usuarios al azar, no tengan el mismo id del usuario que se encuentra registrado
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      //Los campos que obtendremos de los usuarios seleccionados
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });

    return randomUsers;
  } catch (error) {
    console.log("Error fetching random users", error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    if (userId === targetUserId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // follow
      await prisma.$transaction([
        //Una transacción de base de datos hace referencia a una secuencia de operaciones de lectura y escritura que se garantiza que tendrán éxito o fallarán en su totalidad. Esta sección describe las formas en que la API de cliente de Prisma admite transacciones
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, // user being followed
            creatorId: userId, // user following
          },
        }),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error in toggleFollow", error);
    return { success: false, error: "Error toggling follow" };
  }
}
