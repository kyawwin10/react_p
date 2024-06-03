import { CButton, CCol, CFormInput, CFormLabel, CRow } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/AxiosInstance";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import Dashboard from "../dashboard/Dashboard";

const CustomerUpdate = () => {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profile, setProfile] = useState();

  useEffect(() => {
    let updateData = async () => {
      const res = await axiosInstance.get(`/api/customer/edit/${id}`);
      if (res.status == 200) {
        const {
          customer_name,
          customer_email,
          customer_phone,
          customer_address,
          profile_image,
        } = res.data.data;
        setName(customer_name);
        setEmail(customer_email);
        setPhone(customer_phone);
        setAddress(customer_address);
        setProfile(profile_image);
        console.log(res.data.data);
      }
    };
    console.log(updateData);
    updateData();
  }, [id]);

  const updateClick = async () => {
    let formData = new FormData();
    formData.append("edit_customer_name", name);
    formData.append("edit_customer_email", email);
    formData.append("edit_customer_phone", phone);
    formData.append("edit_customer_address", address);
    formData.append("file", profile);
    try {
      const response = await axiosInstance.put(
        `/api/customer/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      console.log(response);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setProfile("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dashboard />

      <div className="head_profile">
        <div className="update_head">
          <p>Customer Update</p>
        </div>

        <div className="fileupload">
          <CFormInput
            type="file"
            onChange={(e) => setProfile(e.target.files[0])}
          />
        </div>
      </div>

      <div className="card-body customer_upd_form mt-4">
        <CRow className="mt-2">
          <CCol lg="6">
            <CRow className="mt-3">
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
          </CCol>
          <CCol lg="6">
            <CRow className="mt-3">
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
        <CButton className="btn btn-info save_buttom" onClick={updateClick}>
          Update
        </CButton>
      </div>
    </>
  );
};

export default CustomerUpdate;
