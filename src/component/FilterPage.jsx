import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  getLaunchSuccess,
  getLimitLaunchList,
  getParticularLaunch,
  getUpcomingLaunch,
} from "../request/ApiRequest";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import moment from "moment";
import ReactPaginate from "react-paginate";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FilterPage = () => {
  const [launchData, setLaunchData] = useState("");
  const [limit, setLimit] = useState(12);
  const [pageCount, setPageCount] = useState(0);
  const [loader, setLoader] = useState(true);
  const [particularLaunch, setParticularLaunch] = useState("");
  const [openLaunchDialog, setOpenLaunchDialog] = useState(false);
  const closeLaunchDialog = () => {
    setOpenLaunchDialog(false);
  };
  const history = useHistory();
  let launch_status = useParams().slug;
  console.log(launch_status);
  useEffect(() => {
    getSuccessLaunchData(launch_status);
  }, []);
  const getLaunchData = (limit, page) => {
    getLimitLaunchList(limit, page)
      .then(async (list) => {
        setLaunchData(list);
        setPageCount(list.length / limit);
        console.log(list);
        setLoader(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const getParticularLaunchData = (id) => {
    getParticularLaunch(id)
      .then(async (list) => {
        setParticularLaunch(list);
        console.log(list);
        setOpenLaunchDialog(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handlePageClick = async (data) => {
    console.log(data.selected);
    setLoader(true);
    let activePage = data.selected + 1;
    // setCurrentPage(activePage);
    console.log(activePage * limit, activePage);

    const newData = await getLaunchData(limit, activePage * limit);
    console.log(newData);
    setLaunchData(newData);
  };
  const getSuccessLaunchData = (launch_status) => {
    console.log(launch_status);
    setLoader(true);
    if (launch_status === "successfull" || launch_status === "failed") {
      let status;
      if (launch_status === "successfull") {
        status = true;
      } else {
        status = false;
      }
      getLaunchSuccess(status)
        .then(async (list) => {
          console.log("success", list);
          setLaunchData(list);
          setLoader(false);
          history.push(`${launch_status}`)
        })
        .catch((err) => {
          console.error(err);
          setLoader(false);
        });
    } else if (launch_status === "all") {
      getLaunchData(limit, 0);
    } else if (launch_status === "upcoming") {
      getUpcomingLaunch()
        .then(async (list) => {
          console.log("success", list);
          setLaunchData(list);
          setLoader(false);
          history.push(`${launch_status}`)
            // window.location.href = `/filter/${launch_status}`;
        })
        .catch((err) => {
          console.error(err);
          setLoader(false);
        });
    } else {
      alert("Unknown launch");
      window.location.href = `/`;
      getLaunchData(limit, 0);
    }
  };
  return (
    <>
      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Box>
          <div className="row justify-content-end mb-4">
            <div className="col-3">
              <select
                name="filter"
                className="form-control"
                onChange={(e) => getSuccessLaunchData(e.target.value)}
              >
                <option value="">Select Launces</option>
                <option selected={launch_status === "all" && true} value="all">All Launches</option>
                <option selected={launch_status === "upcoming" && true} value="upcoming">Upcoming Launches</option>
                <option selected={launch_status === "successfull" && true} value="successfull">Successfull Launches</option>
                <option selected={launch_status === "failed" && true} value="failed">Failed Launches</option>
              </select>
            </div>
          </div>
          <TableContainer component={Paper} style={{ marginBottom: 20 }}>
            <Table aria-label="simple table" size="small">
              <TableHead sx={{ bgcolor: "#f4f5f7" }}>
                <TableRow>
                  <TableCell>No:</TableCell>
                  <TableCell>Launched (UTC)</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Mission</TableCell>
                  <TableCell>Orbit</TableCell>
                  <TableCell>Launch Status</TableCell>
                  <TableCell>Rocket</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ minHeight: "100vh" }}>
                {Array.isArray(launchData) && launchData.length > 0 ? (
                  launchData.map((item, index) => (
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                      }}
                      key={index}
                      onClick={() =>
                        getParticularLaunchData(item.flight_number)
                      }
                    >
                      <TableCell component="th" scope="row">
                        {item.flight_number}
                      </TableCell>
                      <TableCell>
                        {moment(item.launch_date_utc).format(
                          "DD MMM YYYY [at] hh:mm"
                        )}
                      </TableCell>
                      <TableCell>{item.launch_site.site_name}</TableCell>
                      <TableCell>{item.mission_name}</TableCell>
                      <TableCell>
                        {item.rocket.second_stage.payloads[0].orbit}
                      </TableCell>
                      <TableCell>
                        {!item.upcoming ? (
                          !item.launch_success ? (
                            <Chip
                              size="small"
                              sx={{ px: 1 }}
                              label="Fail"
                              style={{
                                backgroundColor: "#fde2e1",
                                color: "#b34f4f",
                              }}
                            />
                          ) : (
                            <Chip
                              size="small"
                              sx={{ px: 1 }}
                              label="Success"
                              style={{
                                backgroundColor: "#def7ec",
                                color: "#2b9d6b",
                              }}
                            />
                          )
                        ) : (
                          <Chip
                            size="small"
                            sx={{ px: 1 }}
                            label="Upcoming"
                            style={{
                              backgroundColor: "#fef3c7",
                              color: "#92400f",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{item.rocket.rocket_name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      height: 180,
                    }}
                  >
                    <TableCell colSpan={7} className="text-center">
                      Data Not found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={9}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-end"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </Box>
        {openLaunchDialog && (
          <Dialog
            open={openLaunchDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeLaunchDialog}
            aria-describedby="alert-dialog-slide-description"
          >
            {/* <DialogTitle onClick={closeLaunchDialog}  style={{textAlign: 'right', cursor: 'pointer', color: '#839494'}}>x</DialogTitle> */}
            <DialogContent>
              <Typography
                onClick={closeLaunchDialog}
                style={{
                  textAlign: "right",
                  cursor: "pointer",
                  color: "#839494",
                }}
              >
                x
              </Typography>

              <div className="row">
                <div className="col-lg-2">
                  <img
                    src={particularLaunch.links.mission_patch}
                    alt={particularLaunch.mission_name}
                    className="img-fluid"
                  />
                </div>
                <div className="col-lg-10">
                  <h5>
                    <span className="mr-2">
                      {particularLaunch.mission_name}{" "}
                    </span>
                    <small>
                      {!particularLaunch.upcoming ? (
                        !particularLaunch.launch_success ? (
                          <Chip
                            size="small"
                            sx={{ px: 1 }}
                            label="Fail"
                            style={{
                              backgroundColor: "#fde2e1",
                              color: "#b34f4f",
                            }}
                          />
                        ) : (
                          <Chip
                            size="small"
                            sx={{ px: 1 }}
                            label="Success"
                            style={{
                              backgroundColor: "#def7ec",
                              color: "#2b9d6b",
                            }}
                          />
                        )
                      ) : (
                        <Chip
                          size="small"
                          sx={{ px: 1 }}
                          label="Upcoming"
                          style={{
                            backgroundColor: "#fef3c7",
                            color: "#92400f",
                          }}
                        />
                      )}
                    </small>
                  </h5>
                  <p style={{ lineHeight: 0 }}>
                    {particularLaunch.rocket.rocket_name}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <DialogContentText id="alert-dialog-slide-description">
                    {particularLaunch.details}
                    <a
                      target="_blank"
                      href={particularLaunch.links.wikipedia}
                      className="ml-2"
                    >
                      Wikipedia
                    </a>
                  </DialogContentText>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-3">
                  <small>Flight No.</small>
                </div>
                <div className="col-9">{particularLaunch.flight_number}</div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Mission Name</small>
                </div>
                <div className="col-9">{particularLaunch.mission_name}</div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Rocket Type</small>
                </div>
                <div className="col-9">
                  {particularLaunch.rocket.rocket_type}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Rocket Name</small>
                </div>
                <div className="col-9">
                  {particularLaunch.rocket.rocket_name}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Manufacturer</small>
                </div>
                <div className="col-9">
                  {particularLaunch.launch_site.site_name}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Nationality</small>
                </div>
                <div className="col-9">
                  {particularLaunch.launch_site.site_name}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Launch Date</small>
                </div>
                <div className="col-9">
                  {" "}
                  {moment(particularLaunch.launch_date_utc).format(
                    "DD MMM YYYY hh:mm"
                  )}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Payload Type</small>
                </div>
                <div className="col-9">
                  {
                    particularLaunch.rocket.second_stage.payloads[0]
                      .payload_type
                  }
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Orbit</small>
                </div>
                <div className="col-9">
                  {particularLaunch.rocket.second_stage.payloads[0].orbit}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Launch Site</small>
                </div>
                <div className="col-9">
                  {particularLaunch.launch_site.site_name_long}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Container>
      {openLaunchDialog && (
          <Dialog
            open={openLaunchDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeLaunchDialog}
            aria-describedby="alert-dialog-slide-description"
          >
            {/* <DialogTitle onClick={closeLaunchDialog}  style={{textAlign: 'right', cursor: 'pointer', color: '#839494'}}>x</DialogTitle> */}
            <DialogContent>
              <Typography
                onClick={closeLaunchDialog}
                style={{
                  textAlign: "right",
                  cursor: "pointer",
                  color: "#839494",
                }}
              >
                x
              </Typography>

              <div className="row">
                <div className="col-lg-2">
                  <img
                    src={particularLaunch.links.mission_patch}
                    alt={particularLaunch.mission_name}
                    className="img-fluid"
                  />
                </div>
                <div className="col-lg-10">
                  <h5>
                    <span className="mr-2">
                      {particularLaunch.mission_name}{" "}
                    </span>
                    <small>
                      {!particularLaunch.upcoming ? (
                        !particularLaunch.launch_success ? (
                          <Chip
                            size="small"
                            sx={{ px: 1 }}
                            label="Fail"
                            style={{
                              backgroundColor: "#fde2e1",
                              color: "#b34f4f",
                            }}
                          />
                        ) : (
                          <Chip
                            size="small"
                            sx={{ px: 1 }}
                            label="Success"
                            style={{
                              backgroundColor: "#def7ec",
                              color: "#2b9d6b",
                            }}
                          />
                        )
                      ) : (
                        <Chip
                          size="small"
                          sx={{ px: 1 }}
                          label="Upcoming"
                          style={{
                            backgroundColor: "#fef3c7",
                            color: "#92400f",
                          }}
                        />
                      )}
                    </small>
                  </h5>
                  <p style={{ lineHeight: 0 }}>
                    {particularLaunch.rocket.rocket_name}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <DialogContentText id="alert-dialog-slide-description">
                    {particularLaunch.details}
                    <a
                      target="_blank"
                      href={particularLaunch.links.wikipedia}
                      className="ml-2"
                    >
                      Wikipedia
                    </a>
                  </DialogContentText>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-3">
                  <small>Flight No.</small>
                </div>
                <div className="col-9">{particularLaunch.flight_number}</div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Mission Name</small>
                </div>
                <div className="col-9">{particularLaunch.mission_name}</div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Rocket Type</small>
                </div>
                <div className="col-9">
                  {particularLaunch.rocket.rocket_type}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Rocket Name</small>
                </div>
                <div className="col-9">
                  {particularLaunch.rocket.rocket_name}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Manufacturer</small>
                </div>
                <div className="col-9">
                  {particularLaunch.launch_site.site_name}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Nationality</small>
                </div>
                <div className="col-9">
                  {particularLaunch.launch_site.site_name}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Launch Date</small>
                </div>
                <div className="col-9">
                  {" "}
                  {moment(particularLaunch.launch_date_utc).format(
                    "DD MMM YYYY hh:mm"
                  )}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Payload Type</small>
                </div>
                <div className="col-9">
                  {
                    particularLaunch.rocket.second_stage.payloads[0]
                      .payload_type
                  }
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Orbit</small>
                </div>
                <div className="col-9">
                  {particularLaunch.rocket.second_stage.payloads[0].orbit}
                </div>
              </div>
              <hr className="my-2" />
              <div className="row">
                <div className="col-3">
                  <small>Launch Site</small>
                </div>
                <div className="col-9">
                  {particularLaunch.launch_site.site_name_long}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
    </>
  );
};

export default FilterPage;
