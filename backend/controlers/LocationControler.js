  const Location = require('../models/location');
  
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


exports.getLocation = async(req , res ) => {
    try {
        const location = await Location.find()
        res.status(200).json({ status: 'success', data: location })
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

exports.getLocationById = async(req,res) => {
  try {
    const location = await Location.findById(req.params.locationId);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.createLocation = async(req,res) =>{
    const {name, kodeLokasi, address, admins} = req.body
    try {
        if(!name || !kodeLokasi || !address || !admins){
            return res.status(400).json({ message:"nama , kodeLokasi , alamat dan admin harus diisi " })
        }

        const existingLocation = await Location.findOne({kodeLokasi});
        if(existingLocation){
            return res.status(400).json({message:" kode sudah ada "})
        }

        const newLocation = new Location({
            name,
            kodeLokasi,
            address,
            admins
        })

        await newLocation.save()

        res.status(200).json({
            message:"lokasi berhasil di tambahkan",
            location:({
                id : newLocation._id,
                name : newLocation.name,
                kodeLokasi : newLocation.kodeLokasi,
                address : newLocation.address,
                admins : newLocation.admins 
            })
        })
        

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateLocation = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid ID format' });

  const { name, kodeLokasi, address, admins } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id, { name, kodeLokasi, address, admins }, { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
