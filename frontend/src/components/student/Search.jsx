import React from 'react'
import CourseCard from './CourseCard';
const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>{searchResults.length > 0 ? (
        <div className="product-card">
          {searchResults.map((course) => (
            <div key={course.id}>
              <div className="card mb-3 card">
              <CourseCard 
            classname={"imgBx"} src={course.video_url} alt={"Image"} h5class={"card-title"} h5style={{marginLeft: "5px"}}
            name={course.name} parastyle={{ marginLeft: "5px"}} price={course.price}
          />
                  {username ? (
                    <>
                      {purchased.some(
                        (item) => item.course_name === course.name
                      ) ? (
                        <button
                          style={{
                            width: "298.5px",
                            fontSize: "13px",
                            backgroundColor: "#CCCCCC",
                            fontWeight:"bolder"
                          }}
                          disabled
                        >
                          Already purchased
                        </button>
                      ) : (
                        <button
                          style={{
                            width: "298.5px",
                            fontSize: "13px",
                          }}
                          onClick={() => handlePurchase(course)}
                        >
                          Purchase course
                        </button>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery.trim() !== "" ? (
        <center>
          <p>No courses found</p>
        </center>
      ) : (<></>)}</div>
  )
}

export default Search