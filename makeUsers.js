var connect = require("./dbConnect");
connect(require("./settings").DEV_DB_URI);

var User = require("./models/User");
var LocationBlog = require("./models/LocationBlog");
var Position = require("./models/Position");

function positionCreator(lon, lat, userId, dateInFuture) {
  var posDetail = { user: userId, loc: { coordinates: [lon, lat] } }
  if (dateInFuture) {
    posDetail.created = "2022-09-25T20:40:21.899Z"
  }
  return posDetail;
}


async function makeData() {
  console.log("Making users")
  try {
    var userInfos = [
      { firstName: "a", lastName: "b", userName: "a", password: "a", email: "a@a.dk", job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }], },
      { firstName: "b", lastName: "b", userName: "b", password: "a", email: "b@a.dk", job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }], },
      { firstName: "c", lastName: "b", userName: "c", password: "a", email: "c@a.dk", job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }], },
    ];
    await User.deleteMany({});
    await Position.deleteMany({});
    await LocationBlog.deleteMany({})

    var users = await User.insertMany(userInfos);

    console.log(users)

    var positions = [
      positionCreator(10, 11, users[0]._id),
      positionCreator(11, 12, users[1]._id, true),
    ]
    await Position.insertMany(positions)
    var blogs = [{ info: "Cool Place", pos: { longitude: 26, latitude: 57 }, author: users[0]._id },]
    LocationBlog.insertMany(blogs)

    var locationBlogs = [
      { info: "Very nice café!", img: "https://media-cdn.tripadvisor.com/media/photo-s/0c/0e/61/91/cafe-amore.jpg", pos: { longitude: 55.714117, latitude: 12.534713, }, author: users[0], },
      { info: "Very nice club!", img: "https://www.straitstimes.com/sites/default/files/styles/xxx_large/public/articles/2017/12/01/st_20171201_arclubs01a_3596913.jpg?itok=1SpGf_tq&timestamp=1512077577", pos: { longitude: 52.714117, latitude: 11.534713, }, author: users[1], }
    ]

    await LocationBlog.insertMany(locationBlogs)

  } catch (err) {
    console.log(err);
  }
}
makeData();

