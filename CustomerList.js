import React, { useEffect, useState } from "react";
import "primeicons/primeicons.css";
import { axiosInstance } from "../api/AxiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { CButton, CFormInput } from "@coreui/react";
import { Pagination } from "react-bootstrap";
import Dashboard from "../dashboard/Dashboard";

const CustomerList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const [sort, setSort] = useState(10);

  // const getAllData = () => {
  //   const dbPromise = idb.open("Create", 2);

  //   dbPromise.onsuccess = () => {
  //     const db = dbPromise.result;

  //     var tx = db.transaction("userData", "readonly");
  //     var userData = tx.objectStore("userData");
  //     const users = userData.getAll();

  //     users.onsuccess = (query) => {
  //       setList(query.srcElement.result);
  //     };

  //     tx.oncomplete = () => {
  //       db.close();
  //     };
  //   };
  // };

  const editClick = async (id) => {
    navigate(`/customerUpdate/${id}`);
  };

  const fetchData = async () => {
    const res = await axiosInstance.get(
      `/api/customer/list?search=${search}&page=${page}&sort=${sort}`
    );
    if (res.status == 200) {
      setList(res.data.data);
      setTotalPage(res.data.lastPage); //lastPage is backend field name
      setDataCount(res.data.totalItems);
    }
  };

  useEffect(() => {
    fetchData();
    // getAllData();
  }, [search, page, sort]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const delClick = async (id) => {
    const delData = await axiosInstance.delete(`/api/customer/delete/${id}`);
    toast.success(delData.data.message);
  };

  const addClick = () => {
    navigate(`/customer`);
  };

  return (
    <>
      <Dashboard />
      <div className="mains_large">
        <div className="customer_header">
          <div className="customer_title">
            <p>Customer List</p>
          </div>

          <div className="add_search">
            <CButton
              className="btn btn-success"
              style={{ width: "100px", height: "35px", marginRight: "10px" }}
              onClick={addClick}
            >
              +Add
            </CButton>

            <CFormInput
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
            />
          </div>
        </div>

        <p className="mt-4">Total Data Count : {dataCount}</p>
        <div>
          <table className="table table-bordered text-center mt-3">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Address</th>
                <th scope="col">Profile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 &&
                list.map((data, index) => (
                  <tr key={index}>
                    <td data-cell="ID" scope="row">
                      {data.custom_id}
                    </td>
                    <td data-cell="Name" scope="row">
                      {data.customer_name}
                    </td>
                    <td data-cell="Email">{data.customer_email}</td>
                    <td data-cell="Phone">{data.customer_phone}</td>
                    <td data-cell="Address">{data.customer_address}</td>
                    <td data-cell="Proifile_Image">
                      <img
                        src={`https://crudinvoicepostgresql.onrender.com${data.profile_image}`}
                        width={30}
                        height={23}
                      />
                    </td>

                    <td
                      className="button_off"
                      style={{ justifyContent: "center" }}
                    >
                      <span
                        className="pi pi-pen-to-square"
                        onClick={() => editClick(data.id)}
                      ></span>
                      &nbsp;&nbsp;
                      <span
                        className="pi pi-trash"
                        onClick={() => delClick(data.id)}
                      ></span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="pagination-body"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
            <option value={dataCount}>All</option>
          </select>

          <Pagination className="justify-content-center">
            <Pagination.First onClick={() => handlePageChange(1)} />
            <Pagination.Prev
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
              disabled={page === 1}
            />
            {[...Array(totalPage)].map((_, index) => {
              // Show only a subset of pages around the current page
              const lowerBound = Math.max(page - 2, 1);
              const upperBound = Math.min(page + 2, totalPage);

              // Render ellipsis if necessary
              if (
                (index + 1 < lowerBound && lowerBound > 2) ||
                (index + 1 > upperBound && upperBound < totalPage - 1)
              ) {
                return null; // Render nothing
              }

              // Render page numbers
              if (
                index + 1 === 1 ||
                index + 1 === totalPage ||
                index + 1 === page ||
                (index + 1 >= lowerBound && index + 1 <= upperBound)
              ) {
                return (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === page}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                );
              }

              // Render ellipsis
              if (
                (index + 1 === lowerBound - 1 && lowerBound > 2) ||
                (index + 1 === upperBound + 1 && upperBound < totalPage - 1)
              ) {
                return <Pagination.Ellipsis key={`ellipsis-${index}`} />;
              }

              return null; // Render nothing
            })}
            <Pagination.Next
              onClick={() => handlePageChange(Math.min(page + 1, totalPage))}
              disabled={page === totalPage}
            />
            <Pagination.Last onClick={() => handlePageChange(totalPage)} />
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default CustomerList;
