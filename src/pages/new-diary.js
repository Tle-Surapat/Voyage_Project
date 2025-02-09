import React, { useState, useEffect } from 'react';
import { ref, push, set } from 'firebase/database'; // Firebase Realtime DB
import { auth, db, storage } from '../components/firebase'; // Firebase configuration
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import AuthHeader from '../components/AuthHeader'; // For header
import Footer from '../components/Footer'; // For footer
import ThailandMap from '../components/Map'; // Thailand interactive map component
import { useRouter } from 'next/router';
import Modal from 'react-modal'; // Modal library for confirmation

// Make sure Modal gets attached to the correct root
Modal.setAppElement('#__next'); // For Next.js

const NewDiary = () => {
  const router = useRouter();
  const user = auth.currentUser; // Get current logged-in user

  const [stateName, setStateName] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stateNames, setStateNames] = useState([]); // To store state names
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeProvince, setActiveProvince] = useState(null); // Active province for the map
  const [showModal, setShowModal] = useState(false);

  // Load state names from the map data
  useEffect(() => {
    const checkMapDataLoaded = () => {
      if (typeof window !== 'undefined' && window.simplemaps_countrymap_mapdata) {
        const mapdata = window.simplemaps_countrymap_mapdata;
        if (mapdata && mapdata.state_specific) {
          const stateList = Object.values(mapdata.state_specific).map((state) => state.name);
          setStateNames(stateList); // Set state names for dropdown
          setMapLoaded(true); // Mark map as loaded
        } else {
          console.error("Mapdata is undefined or doesn't have state_specific.");
        }
      } else {
        console.error("Mapdata is not loaded yet.");
      }
    };

    // Check every 500ms if the map data has loaded
    const mapLoadInterval = setInterval(() => {
      checkMapDataLoaded();
    }, 500);

    // Cleanup the interval when component unmounts
    return () => clearInterval(mapLoadInterval);
  }, []);

  // Handle image upload to Firebase Storage
  const handleImageUpload = (file) => {
    const storageReference = storageRef(storage, `diaryImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageReference, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Handle form submission to save a new diary entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a diary entry');
      return;
    }
  
    setIsLoading(true);
  
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await handleImageUpload(image);
      }
  
      // Save diary entry in Firebase
      const userDiaryRef = ref(db, `diaries/${user.uid}`);
      const newDiaryRef = push(userDiaryRef);
      await set(newDiaryRef, {
        stateName,
        date,
        imageUrl,
        description,
        createdAt: new Date().toISOString(),
      });
  
      // Reset form and show success modal
      setStateName('');
      setDate('');
      setImage(null);
      setDescription('');
      setShowModal(true);
      
    } catch (error) {
      console.error('Error creating diary entry: ', error);
      alert('Failed to create diary entry.');
    } finally {
      setIsLoading(false);
    }
  };
  

  // Close modal and navigate to dashboard
  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />

      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Map Section */}
        <div className="md:w-3/5 w-full bg-dark-green p-6 md:p-24">
          <div className="bg-cream rounded-lg shadow-md p-4">
            <ThailandMap
              activeProvince={activeProvince}
              setActiveProvince={setActiveProvince}
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-2/5 w-full p-6 md:p-8 bg-cream">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 p-4 text-gray-900">New Diary</h2>
          <form onSubmit={handleSubmit}>
            {/* State Dropdown */}
            <div className="mb-4 px-4 md:px-6">
              <label htmlFor="stateName" className="block text-lg text-gray-900">State Name</label>
              <select
                id="stateName"
                className={`w-full p-2 border rounded text-gray-600 ${!mapLoaded ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                required
                disabled={!mapLoaded} // Disable if map data is not loaded
              >
                <option value="">Select State</option>
                {stateNames.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {!mapLoaded && <p className="text-red-500 text-sm mt-1">Map data is loading...</p>}
            </div>

            {/* Date Picker */}
            <div className="mb-4 px-4 md:px-6">
              <label htmlFor="date" className="block text-lg text-gray-900">Date</label>
              <input
                type="date"
                id="date"
                className="w-full p-2 border rounded text-gray-600"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4 px-4 md:px-6">
              <label htmlFor="image" className="block text-lg text-gray-900">Image</label>
              <input
                type="file"
                id="image"
                className="w-full p-2 border rounded text-gray-600"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            {/* Description */}
            <div className="mb-4 px-4 md:px-6">
              <label htmlFor="description" className="block text-lg text-gray-900">Description</label>
              <textarea
                id="description"
                className="w-full p-2 border rounded text-gray-600"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                required
              />
            </div>

            {/* Submit and Back Buttons */}
            <div className="mb-4 px-4 md:px-6 flex justify-between">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-700"
              >
                Back
              </button>

              <button
                type="submit"
                className={`bg-orange-500 text-white py-2 px-6 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'}`}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        contentLabel="Diary Entry Confirmation"
      >
        <div className="bg-white p-8 rounded-lg w-80 text-center">
          <h2 className="mb-4 text-lg text-gray-900">Diary entry created successfully!</h2>
          <button
            className="px-4 py-2 bg-orange text-white font-semibold rounded-md hover:bg-orange-900 focus:outline-none"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default NewDiary;
