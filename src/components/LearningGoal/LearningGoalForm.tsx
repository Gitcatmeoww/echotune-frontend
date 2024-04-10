import React, { useState } from 'react';
import axios from 'axios';
import './LearningGoalForm.css';

const LearningGoalForm = () => {
  const [learningGoal, setLearningGoal] = useState('');
  // const [generatedTags, setGeneratedTags] = useState([]);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);

  // const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState(new Set<string>());

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/learning-goal/',
        { learningGoal },
      );

      if (response.data.status === 'success') {
        console.log(response.data.GeneratedTags);
        const tagsArray = Array.isArray(response.data.GeneratedTags)
          ? response.data.GeneratedTags
          : response.data.GeneratedTags.split(', ');
        setGeneratedTags(tagsArray);
        processTags(tagsArray);

        // setGeneratedTags(response.data.GeneratedTags);

        // console.log(response.data.GeneratedTags);
        // do something with the tags
      } else {
        // Handle any case where the API does not return a status of 'success'
        console.error('API did not return a success status:', response.data);
      }
    } catch (error) {
      console.error('An error occurred while sending data:', error);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prevSelectedTags) => {
      const newSelectedTags = new Set(prevSelectedTags);
      newSelectedTags.delete(tag);

      return newSelectedTags;
    });
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTags((prevSelectedTags) => {
      const newSelectedTags = new Set(prevSelectedTags);
      if (newSelectedTags.has(tag)) {
        newSelectedTags.delete(tag);
      } else {
        // Limit the selection to 5 tags
        if (newSelectedTags.size < 5) {
          newSelectedTags.add(tag);
        }
      }
      return newSelectedTags;
    });
  };

  const processTags = (tagsArray: string[]) => {
    setGeneratedTags(tagsArray);
    // Select the first 5 tags by default
    const initialSelectedTags = new Set(tagsArray.slice(0, 5));
    setSelectedTags(initialSelectedTags);
  };

  // const processTags = (tags: string | string[]) => {
  //   const tagsArray = Array.isArray(tags) ? tags : tags.split(', ');
  //   setGeneratedTags(tagsArray);
  //   // Ensure only the first three tags (or fewer, if there aren't three) are selected
  //   setSelectedTags(new Set(tagsArray.slice(0, Math.min(5, tagsArray.length))));
  // };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="header">
          {/* <button className="back-button">Back</button> */}
          <h1 className="title">What do you want to stay informed about?</h1>
        </div>
        <div className="input-group">
          <textarea
            id="learningGoal"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            placeholder="Tell us what you're curious about"
            className="input-field"
            wrap="soft"
          />

          <button
            type="submit"
            // onSubmit={handleSubmit}
            className="add-button"
          >
            + Add
          </button>
        </div>
      </form>

      {generatedTags.length > 0 ? (
        <>
          <div className="tags-output">
            <p>Select up to 5 keywords</p>
            {generatedTags.map((tag, index) => (
              <div
                key={index}
                className={`tag ${selectedTags.has(tag) ? 'selected' : ''}`}
                onClick={() => handleSelectTag(tag)}
              >
                {tag}
                <span
                  className="tag-close"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the tag container onClick from being called
                    handleRemoveTag(tag);
                  }}
                >
                  x
                </span>
              </div>
            ))}
          </div>
          <button className="continue-button">Continue</button>
        </>
      ) : (
        <div className="examples">
          <p>Examples</p>
          <div className="example">
            Keep me updated on the SF Giants games this season
          </div>
          <div className="example">What is Billie Eilish up to these days?</div>
          <div className="example">
            I want to learn about bird species in the Caribbean Islands
          </div>
          <div className="example">
            Give me trending tips for composting at home
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningGoalForm;

// import React, { useState } from 'react';
// import axios from 'axios';

// const LearningGoalForm = () => {
//   const [learningGoal, setLearningGoal] = useState('');

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/api/learning-goal/',
//         { learningGoal },
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.error('An error occurred while sending data:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
//       <div className="w-full max-w-md">
//         <form onSubmit={handleSubmit} className="mb-4">
//           <h1 className="text-2xl font-bold border-b-2 pb-3 flex-grow">
//             Learning Goal
//           </h1>
//           <input
//             id="learningGoal"
//             type="text"
//             value={learningGoal}
//             onChange={(e) => setLearningGoal(e.target.value)}
//             placeholder="Enter your learning goal"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
//           />
//           <button
//             type="submit"
//             className="bg-black text-white w-full hover:bg-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded focus:outline-none focus:shadow-outline"
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LearningGoalForm;
