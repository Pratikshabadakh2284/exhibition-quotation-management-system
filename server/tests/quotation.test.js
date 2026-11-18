
const mongoose = require("mongoose");

const Quotation = require("../models/Quotation");
const Project = require("../models/Project");
const ProductService = require("../models/ProductService");

const { createQuotation } = require("../controllers/quotationController");

describe("ExpoCraft Quotation Unit Tests", () => {
  const projectId = new mongoose.Types.ObjectId().toString();
  const productId = new mongoose.Types.ObjectId().toString();

  let req;
  let res;

  beforeEach(() => {
    jest.restoreAllMocks();

    req = {
      body: {
        project: projectId,
        items: [
          {
            productService: productId,
            quantity: 2
          }
        ]
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.spyOn(Project, "exists").mockResolvedValue({ _id: projectId });

    jest.spyOn(ProductService, "findById").mockResolvedValue({
      _id: productId,
      name: "Exhibition Stand",
      unitPrice: 850
    });

    jest.spyOn(Quotation, "create").mockImplementation(
      async (data) => data
    );
  });

  test("UT-01: Calculates quotation total correctly", async () => {
    await createQuotation(req, res);

    expect(res.status).toHaveBeenCalledWith(201);

    const quotation = res.json.mock.calls[0][0];

    expect(quotation.items[0].lineTotal).toBe(1700);
    expect(quotation.subtotal).toBe(1700);
  });

  test("UT-02: Rejects zero quantity", async () => {
    req.body.items[0].quantity = 0;

    await createQuotation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Quantity must be greater than zero"
    });

    expect(Quotation.create).not.toHaveBeenCalled();
  });

  test("UT-03: Rejects negative quantity", async () => {
    req.body.items[0].quantity = -2;

    await createQuotation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Quantity must be greater than zero"
    });

    expect(Quotation.create).not.toHaveBeenCalled();
  });
});
