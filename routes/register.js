//import dependencies
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

//import model
const User = require('../models/User');

// @POST api/register - register a user
router.post('/', async (req, res) => {
    const {name, email, password} = req.body;

    try {
      if (!name || !email || !password)
        return res.status(400).json({ msg: "Not all fields have been entered." });      

      let user = await User.findOne({email});
      if (user) 
        return res.status(400).json({msg: 'User already exists'});

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({token});
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

module.exports = router;