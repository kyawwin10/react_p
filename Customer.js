import { CButton, CCol, CFormInput, CFormLabel, CRow } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/AxiosInstance";
import toast from "react-hot-toast";
import Dashboard from "../dashboard/Dashboard";

const Customer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const [allUserData, setAllUsersData] = useState([]);
  const [offline, setOffline] = useState(false);

  const idb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  if (!idb) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }
  console.log(idb);

  const request = idb.open("Create", 2);

  request.onerror = (event) => {
    console.log("An error occurred with IndexedDB");
    console.log("Error", event);
  };

  request.onupgradeneeded = (event) => {
    console.log(event);
    const db = request.result;

    if (!db.objectStoreNames.contains("userData")) {
      db.createObjectStore("userData", { keyPath: "id" });
    }
  };

  request.onsuccess = () => {
    console.log("Database opened successfully");
    const db = request.result;

    var tx = db.transaction("userData", "readwrite");
    var userData = tx.objectStore("userData");

    allUserData.forEach((item) => userData.put(item));

    return tx.complete;
  };

  const getAllData = () => {
    const dbPromise = idb.open("Create", 2);

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      var tx = db.transaction("userData", "readonly");
      var userData = tx.objectStore("userData");
      const users = userData.getAll();

      users.onsuccess = (query) => {
        setAllUsersData(query.srcElement.result);
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  useEffect(() => {
    window.addEventListener("offline", () => {
      setOffline(true);
    });
  }, []);

  useEffect(() => {
    const saveClick = async () => {
      // const dbPromise = idb.open("Create", 2);

      // FormData for handling file uploads
      let formData = new FormData();
      formData.append("customer_name", name);
      formData.append("customer_email", email);
      formData.append("customer_phone", phone);
      formData.append("customer_address", address);
      formData.append("customer_password", password);
      formData.append("file", profile);

      try {
        let saveData = await axiosInstance.post(
          `/api/customer/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(saveData.data.message);
        console.log(saveData);
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setPassword("");
        setProfile(null); // Reset file state after successful upload
      } catch (error) {
        // Handle error
        console.log(error);
      }
    };
  }, [offlineData]);

  return (
    <>
      <Dashboard />
      <div className="customer_head_profile">
        <div className="cus_pro">
          <p>Customer</p>
        </div>

        <div className="profile_photo">
          <CFormInput
            type="file"
            onChange={(e) => setProfile(e.target.files[0])}
          />
        </div>
      </div>

      <div className="customer_upd_form">
        <CRow className="mt-4">
          <CCol lg="6">
            <CRow>
              <CCol lg="2">
                <CFormLabel>Name</CFormLabel>
              </CCol>
              <CCol lg="7">
                <CFormInput
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </CCol>
              <CCol lg="3"></CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol lg="2">
                <CFormLabel>Phone</CFormLabel>
              </CCol>
              <CCol lg="7">
                <CFormInput
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </CCol>
              <CCol lg="3"></CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol lg="2">
                <CFormLabel>password</CFormLabel>
              </CCol>
              <CCol lg="7">
                <CFormInput
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </CCol>
              <CCol lg="3"></CCol>
            </CRow>
          </CCol>

          <CCol lg="6">
            <CRow>
              <CCol lg="2">
                <CFormLabel>Email</CFormLabel>
              </CCol>
              <CCol lg="7">
                <CFormInput
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </CCol>
              <CCol lg="3"></CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol lg="2">
                <CFormLabel>Address</CFormLabel>
              </CCol>
              <CCol lg="7">
                <CFormInput
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </CCol>
              <CCol lg="3"></CCol>
            </CRow>
          </CCol>
        </CRow>
      </div>

      <div style={{ marginLeft: "30px" }}>
        <CButton className="btn btn-success save_buttom" onClick={saveClick}>
          Save
        </CButton>
      </div>

      <button
        onClick={() => {
          if (offline) {
            const data = {
              id: 1,
              name: "mgmg",
              email: "mgmg@gmail.com",
              phone: "002233",
              address: "Yangon",
              password: "12345",
              file: "profile",
            };
          }
        }}
      ></button>
    </>
  );
};

export default Customer;
