import React from "react";
const RegisterFormFields = ({
  formData,
  setFormData,
  handleRegister,
  admin,
  instructor,
  setType,
  type
}) => {
    
  const renderInputField = (type, placeholder, value, onChange, className) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    const showError = (condition, errorMessage) => {
        return condition ? (
          <div style={{ color: "red", textAlign: "left" }}>
            <p>{errorMessage}</p>
          </div>
        ) : null;
      };

  return (
    <>
      <div className="input-container">
        {renderInputField(
          "text",
          `Name of the ${type}`,
          formData.username,
          (e) => setFormData({ ...formData, username: e.target.value }),
          formData.username.length < 6 ? "clicked-input" : ""
        )}
        {showError(
          formData.username.length !== 0 && formData.username.length < 6,
          "*Username should have at least 6 characters"
        )}

        {renderInputField(
          "password",
          "Password",
          formData.password,
          (e) => setFormData({ ...formData, password: e.target.value }),
          formData.password.length < 6 ? "clicked-input" : ""
        )}
        {showError(
          formData.password.length !== 0 && formData.password.length < 6,
          "*Password should have at least 6 characters"
        )}

        {renderInputField(
          "password",
          "Confirm Password",
          formData.confirmPassword,
          (e) => setFormData({ ...formData, confirmPassword: e.target.value }),
          formData.confirmPassword.length < 6 ? "clicked-input" : ""
        )}
        {showError(
          formData.password !== formData.confirmPassword,
          "*Passwords do not match"
        )}

        {renderInputField(
          "email",
          "Email-Address",
          formData.email,
          (e) => setFormData({ ...formData, email: e.target.value }),
          !validateEmail(formData.email) ? "clicked-input" : ""
        )}
        {showError(
          formData.email.length !== 0 && !validateEmail(formData.email),
          "*Invalid Email Address"
        )}
        {admin && (
          <>
            {renderInputField(
              "text",
              "Institution Icon",
              formData.icon,
              (e) => {
                setFormData({ ...formData, icon: e.target.value });
              },
              ""
            )}
          </>
        )}
        {instructor ? (
          <></>
        ) : (
          <>
            <textarea
              className="col-sm-12"
              rows={5}
              cols={74}
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            ></textarea>
          </>
        )}
      </div>
    </>
  );
};
export default RegisterFormFields;
