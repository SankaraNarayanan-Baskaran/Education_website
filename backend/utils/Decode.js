const parseJwt = (req, res, next) => {
  const token = req.cookies.jwtToken;
  console.log(token)
  if(token===undefined){
    req.username="";
    console.log("called");
    next();
  }
 else if (typeof token !== "string") {
    if (typeof token.toString === "function") {
      token = token.toString();
    } else {
      console.error("Invalid token format:", token);
      return null;
    }
  }

  try {
    if(token !== undefined){
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = JSON.parse(
        decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        )
      );
      req.username = jsonPayload.username;
      next();
    }
   
  } catch (error) {
    console.error("Error parsing JWT:", error);
    next(err);
  }
};

module.exports = { parseJwt };
