// import React, { useState } from "react";

// const MyProfile = () => {
//   const [imagePreview, setImagePreview] = useState(null);

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       {/* Header Section */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h4>Personal info</h4>
//           <p className="text-muted">Update your photo and personal details here</p>
//         </div>
//         <div>
//           <button className="btn btn-outline-secondary me-2">Cancel</button>
//           <button className="btn btn-warning text-white">Save</button>
//         </div>
//       </div>

//       {/* Form Section */}
//       <form>
//         {/* Name Input */}
//         <div className="mb-3 row">
//           <label htmlFor="name" className="col-sm-2 col-form-label">
//             Name
//           </label>
//           <div className="col-sm-5">
//             <input
//               type="text"
//               className="form-control"
//               id="firstName"
//               placeholder="First Name"
              
//             />
//           </div>
//           <div className="col-sm-5">
//             <input
//               type="text"
//               className="form-control"
//               id="lastName"
//               placeholder="Last Name"
              
//             />
//           </div>
//         </div>

//         {/* Email Input */}
//         <div className="mb-3 row">
//           <label htmlFor="email" className="col-sm-2 col-form-label">
//             Email address
//           </label>
//           <div className="col-sm-10">
//             <input
//               type="email"
//               className="form-control"
//               id="email"
//               placeholder="student@gmail.com"
//             />
//           </div>
//         </div>

//         {/* Photo Upload Section */}
//         <div className="mb-3 row align-items-center">
//           <label htmlFor="photo" className="col-sm-2 col-form-label">
//             Your Photo
//           </label>
//           <div className="col-sm-2 text-center">
//             <div
//               className="rounded-circle border"
//               style={{
//                 width: "80px",
//                 height: "80px",
//                 overflow: "hidden",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               {imagePreview ? (
//                 <img
//                   src={imagePreview}
//                   alt="Profile"
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               ) : (
//                 <i className="bi bi-person" style={{ fontSize: "2rem" }}></i>
//               )}
//             </div>
//           </div>
//           <div className="col-sm-8">
//             <div className="border rounded p-4 text-center" style={{ backgroundColor: "#f9f9f9" }}>
//               <div className="input-group mb-3">
//                 <input
//                   type="file"
//                   className="form-control"
//                   id="inputGroupFile02"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                 />
//                 <label className="input-group-text" htmlFor="inputGroupFile02">
//                   Upload
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MyProfile;
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../pages/Studentpages/StudentUserContext";
import axios from "axios";

const StudentMyProfile = () => {
  const { user, setUser } = useContext(UserContext);  // Access user context
  const [imagePreview, setImagePreview] = useState(user.photo || null);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [gender, setGender] = useState(user.gender || "");
  const [maritalStatus, setMaritalStatus] = useState(user.maritalStatus || "");
  const [previousDanceEducation, setPreviousDanceEducation] = useState(user.previousDanceEducation || "");
  const [guruName, setGuruName] = useState(user.guruName || "");
  const [phonePrimary, setPhonePrimary] = useState(user.phonePrimary || "");
  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact || "");

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("User is not logged in");
        }

        const response = await axios.get("http://localhost:5000/api/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setGender(data.gender);
        setMaritalStatus(data.maritalStatus);
        setPreviousDanceEducation(data.previousDanceEducation);
        setGuruName(data.guruName);
        setPhonePrimary(data.phonePrimary);
        setEmergencyContact(data.emergencyContact);
        setImagePreview(data.photo);

      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };

    fetchStudentProfile();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("User is not logged in");
      }

      const updatedProfile = {
        firstName,
        lastName,
        photo: imagePreview,
        gender,
        maritalStatus,
        previousDanceEducation,
        guruName,
        phonePrimary,
        emergencyContact,
      };

      const response = await axios.put("http://localhost:5000/api/student/profile", updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the user context
      setUser({
        ...user,
        firstName,
        lastName,
        photo: imagePreview,
        gender,
        maritalStatus,
        previousDanceEducation,
        guruName,
        phonePrimary,
        emergencyContact,
      });

      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>Personal Info</h4>
          <p className="text-muted">Update your photo and personal details here</p>
        </div>
        <div>
          <button className="btn btn-outline-secondary me-2">Cancel</button>
          <button className="btn btn-warning text-white" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* Form Section */}
      <form>
        {/* Name Input */}
        <div className="form-group row">
          <label htmlFor="firstName" className="col-sm-2 col-form-label">First Name</label>
          <div className="col-sm-4">
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="form-control"
              id="firstName"
              placeholder="First Name"
            />
          </div>
          <label htmlFor="lastName" className="col-sm-2 col-form-label">Last Name</label>
          <div className="col-sm-4">
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-control"
              id="lastName"
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Gender and Marital Status */}
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Gender</label>
          <div className="col-sm-4">
            <select
              className="form-control"
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Choose...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <label className="col-sm-2 col-form-label">Marital Status</label>
          <div className="col-sm-4">
            <select
              className="form-control"
              id="maritalStatus"
              name="maritalStatus"
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
            >
              <option value="">Choose...</option>
              <option value="Married">Married</option>
              <option value="Unmarried">Unmarried</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>
        </div>

        {/* Previous Dance Education and Guru Name */}
        <div className="form-group row">
          <label htmlFor="previousDanceEducation" className="col-sm-2 col-form-label">Previous Dance Education</label>
          <div className="col-sm-10">
            <textarea
              className="form-control"
              name="previousDanceEducation"
              value={previousDanceEducation}
              onChange={(e) => setPreviousDanceEducation(e.target.value)}
              id="previousDanceEducation"
              placeholder="Previous Dance Education"
            />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="guruName" className="col-sm-2 col-form-label">Name and address of Guru</label>
          <div className="col-sm-10">
            <textarea
              className="form-control"
              name="guruName"
              value={guruName}
              onChange={(e) => setGuruName(e.target.value)}
              id="guruName"
              placeholder="Name and address of Guru"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-group row">
          <label htmlFor="primaryPhone" className="col-sm-2 col-form-label">Phone Number (Primary)</label>
          <div className="col-sm-4">
            <input
              type="tel"
              name="phonePrimary"
              value={phonePrimary}
              onChange={(e) => setPhonePrimary(e.target.value)}
              className="form-control"
              id="primaryPhone"
              placeholder="eg-(012-345-6789)"
              pattern="[0-9]{10}"
              maxLength="10"
            />
          </div>
          <label htmlFor="emergencyContact" className="col-sm-2 col-form-label">Emergency Contact *</label>
          <div className="col-sm-4">
            <input
              type="tel"
              name="emergencyContact"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="form-control"
              id="emergencyContact"
              placeholder="eg-(012-345-6789)"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="mb-3 row align-items-center">
          <label htmlFor="photo" className="col-sm-2 col-form-label">Your Photo</label>
          <div className="col-sm-2 text-center">
            <div className="rounded-circle border" style={{ width: "80px", height: "80px", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <i className="bi bi-person" style={{ fontSize: "2rem" }}></i>
              )}
            </div>
          </div>
          <div className="col-sm-8">
            <div className="border rounded p-4 text-center" style={{ backgroundColor: "#f9f9f9" }}>
              <div className="input-group mb-3">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="photo"
                  onChange={handleImageUpload}
                />
                <label className="input-group-text" htmlFor="photo">Upload</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentMyProfile;
