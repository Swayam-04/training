const Module = require('../models/Module');

// Create a new module
exports.createModule = async (req, res) => {
    try {
        const { title, description, cutoff_percentage, time_limit } = req.body;
        const newModule = new Module({
            title,
            description,
            cutoff_percentage,
            time_limit
        });
        await newModule.save();
        res.status(201).json(newModule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all modules
exports.getModules = async (req, res) => {
    try {
        const modules = await Module.find();
        res.status(200).json(modules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single module by ID
exports.getModuleById = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ message: 'Module not found' });
        res.status(200).json(module);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a module
exports.updateModule = async (req, res) => {
    try {
        const updatedModule = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedModule) return res.status(404).json({ message: 'Module not found' });
        res.status(200).json(updatedModule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a module
exports.deleteModule = async (req, res) => {
    try {
        const deletedModule = await Module.findByIdAndDelete(req.params.id);
        if (!deletedModule) return res.status(404).json({ message: 'Module not found' });
        res.status(200).json({ message: 'Module deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
