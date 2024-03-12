import { useCookies } from "react-cookie";

const CourseCard = ({
  key,
  classname,
  src,
  alt,
  h5class,
  h5style,
  paraclass,
  parastyle,
  name,
  price,
}) => {
  const [cookies] = useCookies(["icon"]);
  const icon = cookies["icon"];
  return (
    <div>
      <img className={classname} src={src} alt={alt} />
      <div>
        <h5 className={h5class} style={h5style}>
          {name}
        </h5>
        {icon === "yes"?(<><p style={parastyle}>Click below to know more</p></>):(<p style={parastyle}>${price}</p>)}
      </div>
    </div>
  );
};
export default CourseCard;
