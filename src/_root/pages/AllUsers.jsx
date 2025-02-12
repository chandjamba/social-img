import { Card, CardContent } from "@/components/ui/card";
import { useGetAllUsers } from "@/lib/react-query/queriesAndMutation";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const { data: people } = useGetAllUsers();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">People</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {people?.documents?.map((user) => (
          <Card key={user?.accountId} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Link
                to={`/profile/${user?.accountId}`}
                className="flex items-center gap-3"
              >
                <img
                  className="h-14 w-14 rounded-full"
                  src={
                    user?.imageUrl || "/assets/images/profile-placeholder.svg"
                  }
                />
                <div className="flex flex-col">
                  <p className="body-bold">{user?.name}</p>
                  <p className="small-regular text-light-3">
                    @{user?.username}
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
