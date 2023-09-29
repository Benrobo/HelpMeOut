import React from "react";
import Layout from "./Layout";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state?.hasError) {
      // You can render any custom fallback UI
      return (
        <Layout>
          <div className="w-full h-screen flex flex-col items-center justify-center relative">
            <h2 className="text-white-200 N-B text-[20px] ">
              Oops, there is an error!
            </h2>
            <br />
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                window && window.location.reload();
              }}
              className="w-auto px-5 py-3 rounded-md flex items-center justify-center text-center bg-dark-100 text-white-100 ppR text-[13px] "
            >
              Try again?
            </button>
          </div>
        </Layout>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
