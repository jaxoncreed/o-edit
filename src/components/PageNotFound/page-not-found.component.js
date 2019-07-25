/* eslint-disable constructor-super */
import React from "react";
import { Link } from "react-router-dom";
import {
  PageNotFoundWrapper,
  PageNotFoundContent
} from "./page-not-found.style";

/**
 * A React component page that is displayed when there's no valid route. Users can click the button
 * to get back to the home page.
 */
const PageNotFound = () => {
  return (
    <PageNotFoundWrapper>
      <PageNotFoundContent>
        <img src="/img/404.svg" alt="404" />
        <h3>Page not found</h3>
        <p>There may be an error in the URL entered into your web browser. Please check the URL and try again. Or the page you're looking for has been moved or deleted</p>
        <div>
          <Link to="/" className="ids-link">
            Take me back to the welcome page
          </Link>
        </div>
      </PageNotFoundContent>
    </PageNotFoundWrapper>
  );
};

export { PageNotFound };
export default PageNotFound;
