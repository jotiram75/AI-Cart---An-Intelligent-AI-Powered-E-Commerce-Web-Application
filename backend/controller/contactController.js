import Contact from "../model/contactModel.js";

// Submit a contact form
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();

        res.json({ success: true, message: "Your message has been sent successfully!" });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all contact submissions
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, contacts });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
