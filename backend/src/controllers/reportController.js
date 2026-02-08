import { logger } from "../utils/logger.js";
import { buildIncidentesPdfReport } from "../services/reportService.js";
import { buildIncidentesXlsxReport } from "../services/reportService.js";

export const getIncidentesPdfReport = async (req, res, next) => {
  try {
    logger.info("getIncidentesPdfReport called", {
      query: req.query,
      requestId: req.requestId,
    });

    const { buffer, filename } = await buildIncidentesPdfReport(req.query);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    // res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.status(200).send(buffer);
  } catch (err) {
    logger.error("getIncidentesPdfReport failed", {
      message: err.message,
      stack: err.stack,
      requestId: req.requestId,
    });

    return next(err);
  }
};

export const getIncidentesXlsxReport = async (req, res, next) => {
  try {
    logger.info("getIncidentesXlsxReport called", {
      query: req.query,
      requestId: req.requestId,
    });

    const { buffer, filename } = await buildIncidentesXlsxReport(req.query);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.send(buffer);
  } catch (err) {
    logger.error("getIncidentesXlsxReport failed", {
      message: err.message,
      stack: err.stack,
      requestId: req.requestId,
    });

    return next(err);
  }
};
