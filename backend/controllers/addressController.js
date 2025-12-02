const User = require('../models/User');

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('addresses');
        res.json(user.addresses || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
    try {
        const { street, city, state, zip, country, isDefault } = req.body;

        const user = await User.findById(req.user._id);

        // If this is set as default, unset all other defaults
        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // If this is the first address, make it default
        const makeDefault = user.addresses.length === 0 || isDefault;

        user.addresses.push({
            street,
            city,
            state,
            zip,
            country,
            isDefault: makeDefault
        });

        await user.save();
        res.status(201).json(user.addresses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { street, city, state, zip, country, isDefault } = req.body;

        const user = await User.findById(req.user._id);
        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // If setting as default, unset all others
        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        address.street = street || address.street;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zip = zip || address.zip;
        address.country = country || address.country;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await User.findById(req.user._id);

        user.addresses = user.addresses.filter(
            addr => addr._id.toString() !== addressId
        );

        // If deleted address was default and there are other addresses, make first one default
        const hasDefault = user.addresses.some(addr => addr.isDefault);
        if (!hasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set default address
// @route   PUT /api/users/addresses/:addressId/default
// @access  Private
const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await User.findById(req.user._id);

        // Unset all defaults
        user.addresses.forEach(addr => {
            addr.isDefault = false;
        });

        // Set new default
        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        address.isDefault = true;
        await user.save();

        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};
