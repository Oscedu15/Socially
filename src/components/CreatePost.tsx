"use client";
// import { useUser } from "@clerk/nextjs";
// import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
// import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
// import React, { useState } from "react";
// import { Button } from "./ui/button";
// import { Card, CardContent } from "./ui/card";
// import { Textarea } from "./ui/textarea";
// import ImageUpload from "./ImageUpload";
// import { createPost } from "@/actions/post.action";
// import toast from "react-hot-toast";

// function CreatePost() {
//   const { user } = useUser();
//   //useUser para recibibr al usuario
//   const [content, setContent] = useState("");
//   //Aca guardamos el contenido escrito para el posts
//   const [imageUrl, setImageUrl] = useState("");
//   //Aca guardamos el url de la imagen a subir en el posts
//   const [isPosting, setIsPosting] = useState(false);
//   //Estado que almacena un loading o carga a la hora de enviar la informacion
//   const [showImageUpload, setShowImageUpload] = useState(false);
//   //Componente donde almacenaremos la imagen

//   const handleSubmit = async () => {
//     //Si no hay contenido o imagen url, simplemente salimos de la funcion
//     if (!content.trim() && !imageUrl) return;

//     setIsPosting(true);
//     try {
//       const result = await createPost(content, imageUrl);
//       if (result?.success) {
//         // reset the form
//         setContent("");
//         setImageUrl("");
//         setShowImageUpload(false);

//         toast.success("Post created successfully");
//       }
//     } catch (error) {
//       console.error("Failed to create post:", error);
//       toast.error("Failed to create post");
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   return (
//     <Card className="mb-6">
//       <CardContent className="pt-6">
//         <div className="space-y-4">
//           <div className="flex space-x-4">
//             <Avatar className="w-10 h-10 ">
//               <AvatarImage
//                 src={user?.imageUrl || "/avatar.png"}
//                 className="rounded-lg"
//               />
//             </Avatar>
//             <Textarea
//               placeholder="What's on your mind?"
//               className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               disabled={isPosting}
//             />
//           </div>

//           {(showImageUpload || imageUrl) && (
//             <div className="border rounded-lg p-4">
//               <ImageUpload
//                 endpoint="postImage"
//                 value={imageUrl}
//                 onChange={(url) => {
//                   setImageUrl(url);
//                   if (!url) setShowImageUpload(false);
//                 }}
//               />
//             </div>
//           )}

//           <div className="flex items-center justify-between border-t pt-4">
//             <div className="flex space-x-2">
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="text-muted-foreground hover:text-primary"
//                 onClick={() => setShowImageUpload(!showImageUpload)}
//                 disabled={isPosting}
//               >
//                 <ImageIcon className="size-4 mr-2" />
//                 Photo
//               </Button>
//             </div>
//             <Button
//               className="flex items-center"
//               onClick={handleSubmit}
//               //Se desabilitara sino tiene un contenido o una imagen cargada
//               disabled={(!content.trim() && !imageUrl) || isPosting}
//               //El método Trim quita de la cadena actual todos los caracteres de espacio en blanco iniciales y finales
//             >
//               {isPosting ? (
//                 <>
//                   <Loader2Icon className="size-4 mr-2 animate-spin" />
//                   Posting...
//                 </>
//               ) : (
//                 <>
//                   <SendIcon className="size-4 mr-2" />
//                   Post
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// export default CreatePost;

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        // reset the form
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);

        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default CreatePost;
