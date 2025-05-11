// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Signup = () => {
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     age: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const users = JSON.parse(localStorage.getItem("ecoWasteUsersDB")) || [];
//     const emailExists = users.some((user) => user.email === form.email);

//     if (emailExists) {
//       alert("User with this email already exists");
//       return;
//     }

//     const newUser = { id: users.length + 1, ...form };
//     users.push(newUser);

//     localStorage.setItem("ecoWasteUsersDB", JSON.stringify(users));
//     alert("Signup successful!");
//     navigate("/login");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-green-100">
//       <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
//           Create Account
//         </h2>
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           {/* Input Fields Loop */}
//           {["fullName", "email", "phone", "age", "password"].map((field) => (
//             <div key={field}>
//               <label className="block text-sm font-medium capitalize">
//                 {field}
//               </label>
//               <input
//                 type={field === "password" ? "password" : "text"}
//                 name={field}
//                 value={form[field]}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 required
//               />
//             </div>
//           ))}

//           {/* 👇 Add this just before the button */}
//           <div>
//             <label className="block text-sm font-medium">Role</label>
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               <option value="user">Resident</option>
//               <option value="collector">Collector</option>
//               <option value="admin">admin</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-600 mt-4">
//           Already have an account?{" "}
//           <a href="/login" className="text-green-700 font-semibold">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;
