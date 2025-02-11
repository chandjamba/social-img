import { Route, Routes } from "react-router-dom";
import "./global.css";
import AuthLayout from "./_auth/AuthLayout.js";
import SigninForm from "./_auth/forms/SigninForm.js";
import SignupForm from "./_auth/forms/SignupForm.js";
import {
  Explore,
  AllUsers,
  CreatePost,
  Home,
  PostDetails,
  EditPost,
  Profile,
  Saved,
  UpdateProfile,
} from "./_root/pages/index.js";
import RootLayout from "./_root/RootLayout.js";
import { Toaster } from "@/components/ui/toaster";
function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
