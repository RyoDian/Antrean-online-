const Service = require('../models/Service')


exports.createService = async (req, res) => {
  try {
    const { code, name, description } = req.body;

    const newService = new Service({ code, name, description });
    await newService.save();

    res.status(201).json({ message: 'Service created successfully', service: newService });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create service', error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { code, name, description },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update service', error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete service', error: error.message });
  }
};


