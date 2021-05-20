import axios from "axios";
import React, { useState, useEffect, Fragment } from "react";
import Header from "./Header";
import ReviewForm from "./ReviewForm";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
const Column = styled.div`
  background: #fff;
  height: 100vh;
  overflow: scroll;

  &:last-child {
    background: black;
  }
`;
const Main = styled.div`
  padding-left: 50px;
`;

function Airline(props) {
  const [airline, setAirline] = useState({});
  const [review, setReview] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    //api/v1/airlines/united-airlines
    // airlines/united-airlines
    //console.log(props);
    const slug = props.match.params.slug;
    const url = `/api/v1/airlines/${slug}`;

    axios
      .get(url)
      .then((r) => {
        setAirline(r.data);
        setLoaded(true);
      })
      .catch((r) => console.log(r));
  }, []);

  // Modify text in review form
  const handleChange = (e) => {
    setReview(Object.assign({}, review, { [e.target.name]: e.target.value }));
  };

  // Create a review
  const handleSubmit = (e) => {
    e.preventDefault();
    const csrfToken = document.querySelector("[name=csrf-token]").textContent;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    const airline_id = airline.data.id;
    axios
      .post("/api/v1/reviews", { review, airline_id })
      .then((resp) => {
        const included = [...airline.included, resp.data.data];
        setAirline({ ...airline, included });
        setReview({ title: "", description: "", score: 0 });
        setError("");
      })
      .catch((resp) => {});
  };

  return (
    <Wrapper>
      {loaded && (
        <Fragment>
          <Column>
            <Main>
              <Header
                attributes={airline.data.attributes}
                reviews={airline.included}
              />
              <div className="reviews"></div>
            </Main>
          </Column>
          <Column>
            <ReviewForm
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              attributes={airline.data.attributes}
              review={review}
            />
          </Column>
        </Fragment>
      )}
    </Wrapper>
  );
}

export default Airline;
