import { validationResult } from "express-validator";

export const getLocations = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, msg: "Not all fields are submitted." });
  }
  try {
    const { location } = req.query;
    const response = await fetch(`https://maps.gomaps.pro/maps/api/place/queryautocomplete/json?input=${location}&key=${process.env.MAP_API_KEY}`);
    
    if (!response.ok) {
      throw new Error("Error in fetching the data");
    }

    const data = await response.json();
    const responseData = data.predictions.slice(0, 5).map((e) => ({
      description: e.description,
      place_id: e.place_id
    }));

    return res.status(200).json({ success: true, data: responseData });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const getCoords = async (placeId) => {
  if (!placeId) {
      return {ltd:0,lng:0};
  }
  try {
    const response = await fetch(`https://maps.gomaps.pro/maps/api/place/details/json?place_id=${placeId}&key=${process.env.MAP_API_KEY}`);
    const data = await response.json();
    if (data.status === "OK") {
      const { lat, lng } = data.result.geometry.location;
      return { ltd:lat, lng } ;
    } else {
      return {ltd:0,lng:0};
    }
} catch (error) {
    console.log(error);
    return {ltd:0,lng:0};
  }
};
