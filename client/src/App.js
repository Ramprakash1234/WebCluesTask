import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Form, Button } from "semantic-ui-react";

const App = () => {
  const [data, changeData] = useState({
    name: "",
    email: "",
    password: "",
    selectedFile: ""
  });
  const [allUsers, changeUsers] = useState([]);

  useEffect(() => {
    axios.get("/allUsers").then((res) => changeUsers(res.data));
  }, []);

  return (
    <div className="App">
      <h1>Webclues Practical test for Junior MERN stack</h1>
      <p style={{ textAlign: "right", padding: "0 50px" }}>
        Developer : Ramprakash S
      </p>
      <hr></hr>
      <Form enctype="multipart/form-data">
        <Grid style={{ width: "100%", margin: "auto" }}>
          <Grid.Row style={{ display: "flex" }}>
            <Grid.Column style={{ width: "20%" }}>
              Name:{" "}
              <input
                type="text"
                value={data.name}
                onChange={(e) => changeData({ ...data, name: e.target.value })}
              />
            </Grid.Column>
            <Grid.Column style={{ width: "20%" }}>
              E-Mail Id:{" "}
              <input
                type="text"
                value={data.email}
                onChange={(e) => changeData({ ...data, email: e.target.value })}
              />
            </Grid.Column>
            <Grid.Column style={{ width: "20%" }}>
              Password:{" "}
              <input
                type="password"
                value={data.password}
                onChange={(e) =>
                  changeData({ ...data, password: e.target.value })
                }
              />
            </Grid.Column>
            <Grid.Column style={{ width: "25%" }}>
              Profile Pic:{" "}
              <input
                type="file"
                name="profilePic"
                onChange={(e) =>
                  changeData({ ...data, selectedFile: e.target.files })
                }
                single
              />
            </Grid.Column>
            <Grid.Column>
              <Button
                onClick={() => {
                  if (
                    data.name.trim() !== "" &&
                    data.email.trim() !== "" &&
                    data.password.trim() !== "" &&
                    data.selectedFile[0] != undefined
                  ) {
                    const formData = new FormData();
                    formData.append(
                      "profilePic",
                      data.selectedFile[0],
                      data.name + "-" + data.selectedFile[0].name
                    );

                    axios.post("/fileme", formData).then((response) => {
                      axios
                        .post("/addme", {
                          toStoreVals: {
                            ...data,
                            fileName: response.data.fileName
                          }
                        })
                        .then(() => {
                          axios.get("/allUsers").then((res) => {
                            changeUsers(res.data);
                          });
                        });
                    });
                  } else {
                    alert("All fields are mandatory before submitting");
                  }
                }}
              >
                Add
              </Button>
            </Grid.Column>
            <hr />
            <br />
          </Grid.Row>
        </Grid>
      </Form>
      <div style={{ width: "100%" }}>
        <h1>All users info</h1>
        <br />
        {allUsers.map((user) => (
          <div style={{ padding: "0 50px", textAlign: "left" }}>
            <div style={{ display: "inline-block" }}>
              <img
                src={user.picturelink}
                style={{ height: "100px", width: "150px" }}
              />
            </div>
            <div
              style={{
                display: "inline-block",
                height: "100px",
                verticalAlign: "top",
                padding: "0 15px"
              }}
            >
              <h5>Name: {user.name}</h5>
              <p>Email: {user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
