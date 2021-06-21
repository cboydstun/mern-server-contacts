const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Contact = require('../models/Contact');

// @GET api/contacts - get all contacts associated with user
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({user: req.user.id}).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @POST api/contacts - add new contact
router.post('/', auth, async (req, res) => {
    const {name, email, phone, type} = req.body;

    if (!name || !email)
      return res.status(400).json({ msg: "Name and email required." });

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// @PUT api/contacts/:id - update contact
router.put('/:id', auth, async (req, res) => {
  const {name, email, phone, type} = req.body;

  // Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({msg: 'Contact not found'});

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'Not authorized'});
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {$set: contactFields},
      {new: true},
    );

    res.json(contact);
  } catch (err) {
    console.error(er.message);
    res.status(500).send('Server Error');
  }
});

// @DELETE api/contacts/:id - Delete contact
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({msg: 'Contact not found'});

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'Not authorized'});
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({msg: 'Contact removed'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;