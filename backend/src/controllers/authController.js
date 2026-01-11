import jwt from "jsonwebtoken";
export const githubLogin = (req, res, next) => {
  next();
};

export const githubCallback = (req, res) => {
  const { username, displayName, photos, githubToken } = req.user;
  const token = jwt.sign({ username, githubToken }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  console.log("1. GitHub Auth Success for:", username);
  console.log("2. Generated JWT:", token.substring(0, 20) + "...");
  console.log(
    "3. Redirecting to:",
    `${process.env.CLIENT_URL}/dashboard?token=${token}`
  );
  res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
};
