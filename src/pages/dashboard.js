import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ThailandMap from '../components/Map';
import AuthHeader from '../components/AuthHeader';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import { auth } from '../components/firebase'; // Import Firebase Auth to get the current user
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Dashboard = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    date: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);

  // Fetch diary entries when the component mounts
  useEffect(() => {
    const fetchDiaryEntries = async () => {
      const user = auth.currentUser; // Get the logged-in user
      if (user) {
        const db = getDatabase();
        const diaryRef = ref(db, `diaries/${user.uid}`); // Fetch only this user's entries
        onValue(diaryRef, (snapshot) => {
          const data = snapshot.val();
          const entries = data ? Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })) : [];
          setDiaryEntries(entries); // Update state
        });
      }
    };
    fetchDiaryEntries(); // This runs when the component mounts
  }, []); // Empty dependency array ensures it runs only once  

  // Delete a diary entry
  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (user && confirm('Are you sure you want to delete this diary entry?')) {
      const db = getDatabase();
      const diaryRef = ref(db, `diaries/${user.uid}/${id}`);
      await remove(diaryRef); // Delete entry from Firebase
      alert('Diary entry deleted!');
    }
  };

  // Open modal to edit an entry
  const handleEdit = (entry) => {
    setCurrentEntry(entry); // Set the current entry to be edited
    setFormData({
      description: entry.description || '',
      date: entry.date || '',
      imageUrl: entry.imageUrl || ''
    });
    setShowModal(true); // Show modal when editing
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false); // Close modal
    setCurrentEntry(null); // Reset current entry
    setFormData({ description: '', date: '', imageUrl: '' });
    setImageFile(null); // Clear the image file input
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // Update form data dynamically
    });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Store the image file
  };

  // Submit the updated diary entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || !currentEntry) {
      alert('User or entry not found.');
      return;
    }

    const db = getDatabase();
    const diaryRef = ref(db, `diaries/${user.uid}/${currentEntry.id}`); // Update the specific entry

    try {
      if (imageFile) {
        const storage = getStorage();
        const storageReference = storageRef(storage, `images/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageReference, imageFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => { },
          (error) => {
            console.error('Error uploading image:', error);
            alert('Image upload failed!');
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            formData.imageUrl = downloadURL;

            await update(diaryRef, {
              description: formData.description,
              date: formData.date,
              imageUrl: formData.imageUrl,
            });

            alert('Diary entry updated with new image!');
            setShowModal(false); // Close modal after updating
            handleClose(); // Reset form and current entry
          }
        );
      } else {
        await update(diaryRef, {
          description: formData.description,
          date: formData.date,
        });

        alert('Diary entry updated!');
        setShowModal(false); // Close modal
        handleClose(); // Reset form and current entry
      }
    } catch (error) {
      console.error('Error updating diary entry:', error);
      alert('Failed to update diary entry.');
    }
  };

  return (
    // responsive
    <div className="flex flex-col min-h-screen bg-cream"> 
      <AuthHeader />

      <div className="flex-grow flex flex-col md:flex-row">
        {/* Map Section */}
        <div className="md:w-3/5 w-full bg-dark-green p-4">
          <div className='bg-cream rounded-lg shadow-md p-4'>
            <ThailandMap diaryEntries={diaryEntries} />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="md:w-2/5 w-full p-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 p-4 mb-4">Dashboard</h1>

          <div className="flex justify-center mb-4">
            <Link href="/new-diary">
              <button className="bg-orange hover:bg-dark-green text-white py-2 px-4 md:px-6 rounded shadow">
                New Diary
              </button>
            </Link>
          </div>

          {/* Scrollable container for diary list */}
          <div className="bg-white rounded-lg shadow-lg p-4 max-h-80 md:max-h-96 overflow-y-auto">
            {diaryEntries.length > 0 ? (
              diaryEntries.map((entry) => (
                <div key={entry.id} className="bg-gray-200 p-4 rounded-lg flex justify-between items-center mb-4 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <img
                      src={entry.imageUrl || '/path-to-placeholder-image.jpg'}
                      alt={entry.stateName}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{entry.stateName}</h3>
                      <p className="text-sm text-gray-600">{entry.description}</p>
                      <p className="text-xs text-gray-500">Date: {new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 md:space-x-4">
                    {/* Edit Button */}
                    <button onClick={() => handleEdit(entry)} className="text-gray-500 hover:text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3v4M8 3v4M3 10h18M5 12h14l1 10H4l1-10z" />
                      </svg>
                    </button>

                    {/* Delete Button */}
                    <button onClick={() => handleDelete(entry.id)} className="text-red-500 hover:text-red-700">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4v4m4-4v4m-7 4h10" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No diary entries found</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Editing */}
      {showModal && (
        <Modal show={showModal} handleClose={handleClose}>
          <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Edit Diary Entry</h2>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 p-2 border w-full rounded-md text-gray-900"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 p-2 border w-full rounded-md text-gray-900"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="mt-1 p-2 border w-full rounded-md text-gray-900"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}


      <Footer />
    </div>
  );
};

export default Dashboard;
