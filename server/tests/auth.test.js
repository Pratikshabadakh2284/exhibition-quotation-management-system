
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  login,
  createStaff,
  changePassword
} = require("../controllers/authController");

describe("ExpoCraft Authentication Unit Tests", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.restoreAllMocks();

    process.env.JWT_SECRET = "test-secret-for-unit-tests";

    req = {
      body: {
        email: "admin@example.com",
        password: "Password123"
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
  });

  test("UT-04: Rejects empty email", async () => {
    req.body.email = "";

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email and password are required"
    });
  });

  test("UT-05: Rejects incorrect password", async () => {
    jest.spyOn(User, "findOne").mockReturnValue({
      select: jest.fn().mockResolvedValue({
        password: "hashed-password"
      })
    });

    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password"
    });
  });

  test("UT-06: Rejects NoSQL injection input", async () => {
    req.body.email = { $ne: null };

    const findOneSpy = jest.spyOn(User, "findOne");

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(findOneSpy).not.toHaveBeenCalled();
  });

  test("UT-07: Allows successful login", async () => {
    const user = {
      _id: "507f1f77bcf86cd799439011",
      name: "Test Admin",
      email: "admin@example.com",
      role: "admin",
      password: "hashed-password"
    };

    jest.spyOn(User, "findOne").mockReturnValue({
      select: jest.fn().mockResolvedValue(user)
    });

    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    jest.spyOn(jwt, "sign").mockReturnValue("mock-jwt-token");

    await login(req, res);

    expect(res.cookie).toHaveBeenCalledWith(
      "expocraft_token",
      "mock-jwt-token",
      expect.objectContaining({
        httpOnly: true
      })
    );

    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });

  test("UT-08: Rejects unregistered email", async () => {
    jest.spyOn(User, "findOne").mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password"
    });
  });

test("UT-09: Rejects staff password shorter than 8 characters", async () => {
  req.body = {
    name: "Test Staff",
    email: "staff@example.com",
    password: "12345"
  };

  await createStaff(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: "Password must be at least 8 characters"
  });
});

test("UT-10: Creates staff account with hashed password", async () => {
  req.body = {
    name: "Test Staff",
    email: "staff@example.com",
    password: "Password123"
  };

  jest.spyOn(User, "findOne").mockResolvedValue(null);
  jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password");

  const createSpy = jest.spyOn(User, "create").mockResolvedValue({
    _id: "507f1f77bcf86cd799439012",
    name: "Test Staff",
    email: "staff@example.com",
    role: "staff"
  });

  await createStaff(req, res);

  expect(bcrypt.hash).toHaveBeenCalledWith("Password123", 10);

  expect(createSpy).toHaveBeenCalledWith({
    name: "Test Staff",
    email: "staff@example.com",
    password: "hashed-password",
    role: "staff"
  });

  expect(res.status).toHaveBeenCalledWith(201);
});

test("UT-11: Rejects new password shorter than 8 characters", async () => {
  req.body = {
    currentPassword: "OldPassword123",
    newPassword: "12345"
  };

  await changePassword(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: "Enter your current password and a new password of at least 8 characters"
  });
});

test("UT-12: Rejects incorrect current password", async () => {
  req.user = {
    _id: "507f1f77bcf86cd799439011"
  };

  req.body = {
    currentPassword: "WrongPassword123",
    newPassword: "NewPassword123"
  };

  jest.spyOn(User, "findById").mockReturnValue({
    select: jest.fn().mockResolvedValue({
      password: "hashed-password"
    })
  });

  jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

  await changePassword(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    message: "Current password is incorrect"
  });
});

});
