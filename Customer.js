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
  const [offline, setOffline] = useState(!navigator.onLine);

  const dbVersion = 2;
  const dbName = "Create";

  useEffect(() => {
    // Listen for online/offline status changes
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Fetch initial data
    getAllData();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Open IndexedDB and create object store if necessary
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);

      request.onerror = (event) => {
        console.error("An error occurred with IndexedDB", event);
        reject(event);
      };

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains("userData")) {
          db.createObjectStore("userData", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  };

  // Save data to IndexedDB
  const saveDataToIndexedDB = async (data) => {
    const db = await openDB();
    const tx = db.transaction("userData", "readwrite");
    const store = tx.objectStore("userData");
    store.put(data);
    return tx.complete;
  };

  // Retrieve all data from IndexedDB
  const getAllData = async () => {
    const db = await openDB();
    const tx = db.transaction("userData", "readonly");
    const store = tx.objectStore("userData");
    const request = store.getAll();

    request.onsuccess = () => {
      setAllUsersData(request.result);
    };

    tx.oncomplete = () => {
      db.close();
    };
  };

  const saveClick = async () => {
    const customerData = {
      name,
      email,
      phone,
      address,
      password,
      profile,
    };

    if (offline) {
      // Save data to IndexedDB for offline use
      await saveDataToIndexedDB(customerData);
      toast.success("Data saved offline");
    } else {
      try {
        // Upload data to server
        let formData = new FormData();
        formData.append("customer_name", name);
        formData.append("customer_email", email);
        formData.append("customer_phone", phone);
        formData.append("customer_address", address);
        formData.append("customer_password", password);
        formData.append("file", profile);

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

        // Clear form inputs
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setPassword("");
        setProfile(null);

        // Fetch latest data
        getAllData();
      } catch (error) {
        console.error(error);
      }
    }
  };

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
        {offline ? (
          <CButton
            className="btn btn-success save_buttom"
            onClick={() => {
              if (offline) {
                const data = {
                  id: allUserData.length + 1,
                  name,
                  email,
                  phone,
                  address,
                  password,
                  profile,
                };
                saveDataToIndexedDB(data);
              }
            }}
          >
            Save
          </CButton>
        ) : (
          <CButton className="btn btn-success save_buttom" onClick={saveClick}>
            Save
          </CButton>
        )}
      </div>
    </>
  );
};

export default Customer;
