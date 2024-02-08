const CourseCard = ({key,classname,src,alt,h5class,h5style,paraclass,parastyle,name,price}) => (

 
  <div className="card mb-3 card">

    <img className={classname} src={src} alt={alt} />
    <div>
      <h5 className={h5class} style={h5style}>
        {name}
      </h5>
      <p style={parastyle}>${price}</p>
    
  
  </div>
  </div>
);
export default CourseCard;