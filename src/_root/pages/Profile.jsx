import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatars";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useGetUserById } from "@/lib/react-query/queriesAndMutation";
import { useParams } from "react-router-dom";
const Profile = () => {
  const params = useParams();
  const { data: userData } = useGetUserById(params?.id);
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userData?.imageUrl} alt={userData?.name} />
            <AvatarFallback>{userData?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{userData?.name}</CardTitle>
            <CardDescription>@{userData?.username}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Email: {userData?.email}
          </p>
          <p className="text-sm text-muted-foreground">
            Joined:{" "}
            {userData?.$createdAt
              ? format(new Date(userData?.$createdAt), "MMMM d, yyyy")
              : "-"}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <PostCard post={userData?.posts} />
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {userData?.save?.map((savedItem, index) => (
              <PostCard key={index} post={savedItem.post[0]} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

function PostCard({ post }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{post?.caption}</CardTitle>
        <CardDescription>{post?.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square">
          <img
            src={post?.imageUrl || "/placeholder.svg"}
            alt={post?.caption}
            className="rounded-md"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Posted on:{" "}
          {post?.$createdAt
            ? format(new Date(post?.$createdAt), "MMMM d, yyyy")
            : "-"}
        </p>
      </CardContent>
    </Card>
  );
}
