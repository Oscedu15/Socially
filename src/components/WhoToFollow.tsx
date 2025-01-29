import { getRandomUsers } from "@/actions/user.action";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "lucide-react";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import FollowButton from "./FollowButton";

async function WhoToFollow() {
  //Funcion que nos dara unos usuarios al azar desde el backend
  const users = await getRandomUsers();

  //Si la cantidad de usuarios es igual a 0, retorna null
  if (users.length === 0) return <div>Not Found</div>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-2 items-center justify-between "
            >
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-xs">
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-medium cursor-pointer"
                  >
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">
                    {user._count.followers} followers
                  </p>
                </div>
              </div>
              {/* Le pasamos como props el id del usuario que queremos seguir o dejar de seguir */}
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default WhoToFollow;
