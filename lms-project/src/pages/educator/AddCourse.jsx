import React, { useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter chapter name :");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };

        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <div className="w-full p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        {/* Course Title */}
        <div className="space-y-2">
          <p className="font-medium text-gray-700">Course Title</p>
          <input
            onChange={(evt) => setCourseTitle(evt.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            required
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none 
        focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Course Description */}
        <div className="space-y-2">
          <p className="font-medium text-gray-700">Course Description</p>
          <div
            ref={editorRef}
            className="min-h-[180px] bg-white rounded-xl border shadow-sm p-2"
          ></div>
        </div>

        {/* Price + Thumbnail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Price */}
          <div className="space-y-2">
            <p className="font-medium text-gray-700">Course Price</p>
            <input
              onChange={(evt) => setCoursePrice(evt.target.value)}
              value={coursePrice}
              type="text"
              placeholder="0"
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none 
            focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <p className="font-medium text-gray-700">Discount (%)</p>

            <input
              onChange={(evt) => setDiscount(evt.target.value)}
              value={discount}
              placeholder="0"
              type="number"
              min="0"
              max="100"
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none 
              focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              required
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <p className="font-medium text-gray-700">Course Thumbnail</p>

            <label
              htmlFor="thumbnailImage"
              className="flex flex-col items-center justify-center border rounded-xl p-6 
          cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all shadow-sm"
            >
              <img
                src={assets.file_upload_icon}
                alt=""
                className="w-10 opacity-70 mb-3"
              />

              <span className="text-gray-600 text-sm">Upload Thumbnail</span>

              <input
                type="file"
                id="thumbnailImage"
                onChange={(evt) => setImage(evt.target.files[0])}
                accept="image/*"
                hidden
              />

              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full mt-4 rounded-lg shadow-md object-cover max-h-40"
                />
              )}
            </label>
          </div>
        </div>

        {/* Chapters + Lectures Section */}
        <div className="mt-10 space-y-8">
          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapterIndex}
              className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden"
            >
              {/* Chapter Header */}
              <div
                className="flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 
                cursor-pointer transition"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <img
                    onClick={() => handleChapter("toggle", chapter.chapterId)}
                    src={assets.down_arrow_icon}
                    alt=""
                    className={`w-3 cursor-pointer transition-transform ${
                      chapter.collapsed ? "-rotate-90" : "rotate-0"
                    }`}
                  />

                  <span className="font-semibold text-gray-800 text-sm">
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-5">
                  <span className="text-xs text-gray-500">
                    {chapter.chapterContent.length} lectures
                  </span>

                  <img
                    src={assets.cross_icon}
                    alt=""
                    onClick={() => handleChapter("remove", chapter.chapterId)}
                    className="w-3.5 cursor-pointer opacity-60 hover:opacity-100 hover:scale-110 transition"
                  />
                </div>
              </div>

              {/* Chapter Lectures */}
              {!chapter.collapsed && (
                <div className="px-5 py-4 space-y-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div
                      key={lectureIndex}
                      className="flex justify-between items-start bg-white border border-gray-200 
                       rounded-xl p-4 shadow-sm hover:shadow-md transition"
                    >
                      {/* Lecture Left */}
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-semibold text-sm">
                          {lectureIndex + 1}. {lecture.lectureTitle}
                        </span>

                        <span className="text-gray-600 text-xs mt-1 leading-5">
                          {lecture.lectureDuration} mins {" • "}
                          <a
                            href={lecture.lectureUrl}
                            target="_blank"
                            className="underline hover:text-gray-800"
                          >
                            Link
                          </a>
                          {" • "}
                          <span className="font-medium">
                            {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                          </span>
                        </span>
                      </div>

                      {/* Delete icon */}
                      <img
                        src={assets.cross_icon}
                        alt=""
                        className="w-4 cursor-pointer opacity-50 hover:opacity-100 hover:scale-110 transition-all"
                        onClick={() =>
                          handleLecture(
                            "remove",
                            chapter.chapterId,
                            lectureIndex
                          )
                        }
                      />
                    </div>
                  ))}

                  {/* Add Lecture */}
                  <p
                    className="text-sm text-gray-600 font-medium cursor-pointer hover:underline"
                    onClick={() => handleLecture("add", chapter.chapterId)}
                  >
                    + Add lecture
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Add Chapter Button */}
          <div
            onClick={() => handleChapter("add")}
            className="px-5 py-2 border border-gray-400 rounded-lg w-fit cursor-pointer 
            text-sm font-medium hover:bg-gray-100 transition"
          >
            + Add chapter
          </div>

          {/* Popup Modal */}
          {showPopup && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-96 rounded-xl p-6 relative shadow-xl">
                <img
                  src={assets.cross_icon}
                  alt=""
                  onClick={() => setShowPopup(false)}
                  className="w-3 absolute top-4 right-4 cursor-pointer hover:scale-110 transition"
                />

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                  Add Lecture
                </h2>

                {/* Lecture Title */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Lecture Title
                  </p>
                  <input
                    type="text"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureTitle: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none 
                    focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Duration (mins)
                  </p>
                  <input
                    type="number"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureDuration: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none 
                    focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                {/* URL */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Lecture URL
                  </p>
                  <input
                    type="text"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureUrl: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none 
                    focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                {/* Free Preview */}
                <div className="flex items-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                  />
                  <p className="text-sm font-medium text-gray-700">
                    Free preview?
                  </p>
                </div>

                {/* Add Button */}
                <button
                  onClick={addLecture}
                  className="w-full border border-gray-400 py-2 rounded-lg font-medium 
                   text-sm hover:bg-gray-100 transition"
                >
                  Add Lecture
                </button>
              </div>
            </div>
          )}

          {/* Final Submit Button */}
          <button
            type="submit"
            className="mt-6 border border-gray-400 px-6 py-3 rounded-lg font-medium text-sm 
            hover:bg-gray-100 transition"
          >
            ADD
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
