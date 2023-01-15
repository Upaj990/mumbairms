import * as React from 'react';
import {
  Alert,
  AppBar,
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Snackbar,
  Step,
  StepButton,
  Stepper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineDropbox, AiOutlineUserAdd } from 'react-icons/ai';
import { BsCheck2Circle } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoWalletOutline } from 'react-icons/io5';
import { GiKnifeFork, GiRoundTable } from 'react-icons/gi';
import { MdDeliveryDining, MdClose } from 'react-icons/md';
import NumberFormat from 'react-number-format';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TableCell } from '@mui/material';
import type { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import _ from '../../config';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  Bar,
  BarChart,
} from 'recharts';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';
import { BASE_URL, PATH } from '../../api';
import moment from 'moment';
import { TrendingUp } from '@mui/icons-material';
import axios from 'axios'

const data = [
  {
    name: '10 AM',
    uv: 4000,
    pv: 2400,
  },
  {
    name: '12 PM',
    uv: 3000,
    pv: 1398,
  },
  {
    name: '2 PM',
    uv: 2000,
    pv: 9000,
  },
  {
    name: '6 PM',
    uv: 3400,
    pv: 3908,
  },
  {
    name: '8 AM',
    uv: 1890,
    pv: 4800,
  },
  {
    name: '12 AM',
    uv: 2390,
    pv: 3800,
  },
  {
    name: '02 AM',
    uv: 1000,
    pv: 4500,
  },
];

const weekly = [
  {
    name: 'Sun',
    from: moment().startOf('week'),
    to: moment().startOf('week').add(1, 'days'),
  },
  {
    name: 'Mon',
    from: moment().startOf('week').add(1, 'days'),
    to: moment().startOf('week').add(2, 'days'),
  },
  {
    name: 'Tue',
    from: moment().startOf('week').add(2, 'days'),
    to: moment().startOf('week').add(3, 'days'),
  },
  {
    name: 'Wed',
    from: moment().startOf('week').add(3, 'days'),
    to: moment().startOf('week').add(4, 'days'),
  },
  {
    name: 'Thur',
    from: moment().startOf('week').add(4, 'days'),
    to: moment().startOf('week').add(5, 'days'),
  },
  {
    name: 'Fri',
    from: moment().startOf('week').add(5, 'days'),
    to: moment().startOf('week').add(6, 'days'),
  },
  {
    name: 'Sat',
    from: moment().startOf('week').add(6, 'days'),
    to: moment().startOf('week').add(7, 'days'),
  },
];

const monthly = [
  {
    name: 'Week 1',
    from: moment().startOf('month'),
    to: moment().startOf('month').add(1, 'weeks'),
  },
  {
    name: 'Week 2',
    from: moment().startOf('month').add(1, 'weeks'),
    to: moment().startOf('month').add(2, 'weeks'),
  },
  {
    name: 'Week 3',
    from: moment().startOf('month').add(2, 'weeks'),
    to: moment().startOf('month').add(3, 'weeks'),
  },
  {
    name: 'Week 4',
    from: moment().startOf('month').add(3, 'weeks'),
    to: moment().startOf('month').add(4, 'weeks'),
  },
];

const today = [
  {
    name: '12 AM',
    from: moment().startOf('day'),
    to: moment().startOf('day').add(3, 'hours'),
  },
  {
    name: '3 AM',
    from: moment().startOf('day').add(3, 'hours'),
    to: moment().startOf('day').add(6, 'hours'),
  },
  {
    name: '6 AM',
    from: moment().startOf('day').add(6, 'hours'),
    to: moment().startOf('day').add(9, 'hours'),
  },
  {
    name: '9 AM',
    from: moment().startOf('day').add(9, 'hours'),
    to: moment().startOf('day').add(12, 'hours'),
  },
  {
    name: '12 PM',
    from: moment().startOf('day').add(12, 'hours'),
    to: moment().startOf('day').add(15, 'hours'),
  },
  {
    name: '3 PM',
    from: moment().startOf('day').add(15, 'hours'),
    to: moment().startOf('day').add(18, 'hours'),
  },
  {
    name: '6 PM',
    from: moment().startOf('day').add(18, 'hours'),
    to: moment().startOf('day').add(21, 'hours'),
  },
  {
    name: '12 PM',
    from: moment().startOf('day').add(21, 'hours'),
    to: moment().startOf('day').add(24, 'hours'),
  },
];

const yearly = [
  {
    name: 'Quarter 1',
    from: moment().startOf('year'),
    to: moment().startOf('year').add(3, 'months'),
  },
  {
    name: 'Quarter 2',
    from: moment().startOf('year').add(3, 'months'),
    to: moment().startOf('year').add(6, 'months'),
  },
  {
    name: 'Quarter 3',
    from: moment().startOf('year').add(6, 'months'),
    to: moment().startOf('year').add(9, 'months'),
  },
  {
    name: 'Quarter 4',
    from: moment().startOf('year').add(9, 'months'),
    to: moment().startOf('year').add(12, 'months'),
  },
];

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
const NumberFormatCustom = React.forwardRef<NumberFormat<any>, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        //thousandSeparator
        isNumericString
        //prefix="₹"
      />
    );
  }
);

const theme = createTheme({
  palette: {
    secondary: {
      main: _.colors.colorDarkGray,
      contrastText: _.colors.colorWhite,
    },
  },
});

function createData(
  id: number,
  order_name: string,
  customer_name: string,
  location: string,
  order_status: number,
  delivery_time: number,
  price: number
) {
  return {
    id,
    order_name,
    customer_name,
    location,
    order_status,
    delivery_time,
    price,
  };
}

const rows = [
  createData(1, 'Forinos Pizza', 'Penelope', 'Mexico', 0, 10.5, 200),
  createData(2, 'Platoon Pizza', 'Shira', 'Mexico', 1, 10.5, 200),
  createData(3, 'Forinos Pizza', 'Penelope', 'Mexico', 0, 10.5, 200),
  createData(4, 'Forinos Pizza', 'Giselle', 'Mexico', 2, 10.5, 200),
  createData(5, 'Forinos Pizza', 'Josephine', 'Mexico', 2, 10.5, 200),
];

const OrderStatusView = (props: any) => {
  const { item } = props;

  return (
    <Box
      sx={{
        minWidth: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        style={{
          display: 'flex',
          backgroundColor: _.statusColor.find(
            (a: any) => a.status === item?.order_status.title
          )?.light,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          padding: '4px 8px',
        }}
      >
        <GoPrimitiveDot
          color={
            _.statusColor.find(
              (a: any) => a.status === item?.order_status.title
            )?.dark
          }
          size={14}
        />
        <Typography
          variant='h1'
          sx={{
            fontSize: 12,
            color: _.statusColor.find(
              (a: any) => a.status === item?.order_status.title
            )?.dark,
            fontWeight: 'bold',
            marginLeft: 0.5,
          }}
          component='div'
        >
          {item?.order_status.title}
        </Typography>
      </Box>
    </Box>
  );
};

const OrderTypeView = (props: any) => {
  const { item } = props;

  return (
    <Box
      sx={{
        minWidth: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        style={{
          display: 'flex',
          backgroundColor: _.colors.colorExtraLightGray,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          padding: '2px 12px',
        }}
      >
        {item?.order_type === 'dine_in' ? (
          <GiKnifeFork color={_.colors.colorDarkGray} size={14} />
        ) : (
          <MdDeliveryDining color={_.colors.colorDarkGray} size={16} />
        )}
        <Typography
          noWrap
          variant='h6'
          sx={{
            fontSize: 12,
            fontWeight: 'bold',
            color: _.colors.colorDarkGray,
            marginLeft: 0.8,
          }}
          component='div'
        >
          {item?.order_type === 'dine_in' ? 'Dine In' : 'Parcel'}
        </Typography>
      </Box>
    </Box>
  );
};

interface Props {
  window?: () => Window;
}

const UserNameView = (props: any) => {
  const { item } = props;
  return (
    <Box
      sx={{
        minWidth: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant='caption'
        sx={{ fontSize: 16, color: _.colors.colorBlack }}
        component='div'
      >
        {item?.user?.name}
      </Typography>
      <Typography
        variant='caption'
        sx={{ fontSize: 15, color: _.colors.colorTitle }}
        component='div'
      >
        +91 {item?.user?.phone}
      </Typography>
    </Box>
  );
};

const DateTimeView = (props: any) => {
  const { item } = props;
  return (
    <Box
      sx={{
        minWidth: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant='caption'
        sx={{ fontSize: 16, color: _.colors.colorBlack }}
        component='div'
      >
        {moment(item?.order_date_and_time).format('D MMMM YYYY')}
      </Typography>
      <Typography
        variant='caption'
        sx={{ fontSize: 15, color: _.colors.colorTitle }}
        component='div'
      >
        {moment(item?.order_date_and_time).format('h:mm:ss a')}
      </Typography>
    </Box>
  );
};

const PaymentStatusView = (props: any) => {
  const { item } = props;
  return (
    <Box
      sx={{
        minHeight: '80px',
        minWidth: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        style={{
          display: 'flex',
          backgroundColor:
            item?.payment_status?.title === 'Unpaid'
              ? 'rgba(255, 0, 92, 0.07)'
              : 'rgba(0, 200, 100, 0.07)',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          padding: '4px 8px',
        }}
      >
        <GoPrimitiveDot
          color={
            item?.payment_status?.title === 'Unpaid'
              ? 'rgba(255, 0, 92, 1)'
              : 'rgba(0, 200, 100, 1)'
          }
          size={14}
        />
        <Typography
          variant='h1'
          sx={{
            fontSize: 12,
            color:
              item?.payment_status?.title === 'Unpaid'
                ? 'rgba(255, 0, 92, 1)'
                : 'rgba(0, 200, 100, 1)',
            fontWeight: 'bold',
            marginLeft: 0.5,
          }}
          component='div'
        >
          {item?.payment_status?.title === 'Unpaid' ? 'Unpaid' : 'Paid'}
        </Typography>
      </Box>
    </Box>
  );
};

export default function Dashboard() {
  const { pathname } = useLocation();
  const [activity, setactivity] = useState('10');
  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target, 'event');
    setactivity(event.target.value as string);
  };
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const [openSnackbar, setopenSnackbar] = useState<any>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    message: null,
    type: 'error',
  });
  const { vertical, horizontal, open, message, type } = openSnackbar;

  const snackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    setopenSnackbar({ ...openSnackbar, open: false });
  };
  const [orderList, setorderList] = useState<any>([]);
  const [recentOrderList, setRecentOrderList] = useState<any>([]);
  const [chartData, setChartData] = useState<any>([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setloading] = useState(false);
  const [trackValue, settrackValue] = useState('');
  const placed_status = [
    {
      id: 1,
      name: 'Placed',
    },
    {
      id: 2,
      name: 'Accepted',
    },
    {
      id: 3,
      name: 'Preparing',
    },
    {
      id: 4,
      name: 'Served',
    },
    {
      id: 5,
      name: 'Completed',
    },
  ];
  const complete_status = [
    {
      id: 1,
      name: 'Placed',
    },
    {
      id: 2,
      name: 'Completed',
    },
  ];
  const cancelled_status = [
    {
      id: 1,
      name: 'Placed',
    },
    {
      id: 2,
      name: 'Rejected',
    },
  ];
  const [stepsArr, setstepsArr] = useState(placed_status);
  const [activeStepValue, setactiveStepValue] = useState(0);

  const { userDetails } = useSelector((state: RootState) => state);

  const _trackOrder = (value: any) => {
    setloading(true);
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      order_id: value,
    });
    var config = {
      method: 'post',
      url: BASE_URL + PATH.ORDER_TRACK,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };

    axios(config)
      .then(function (response: any) {
        console.log(JSON.stringify(response.data));
        setloading(false);
        if (response.data.status) {
          if (response.data.data.id === 'COM') {
            setstepsArr(complete_status);
            setactiveStepValue(2);
          } else if (response.data.data.id === 'CAN') {
            setstepsArr(cancelled_status);
            setactiveStepValue(2);
          } else {
            setstepsArr(placed_status);
            let value =
              response.data.data.title === 'Prepared'
                ? 3
                : placed_status.find(
                    (a: any) => a.name === response.data.data.title
                  )?.id;
            setactiveStepValue(Number(value) - 1);
          }
        } else {
          setopenSnackbar({
            ...openSnackbar,
            open: true,
            message: 'No record found',
            type: 'error',
          });
        }
      })
      .catch(function (error: any) {
        console.log(error);
        setloading(false);
      });
  };

  useEffect(() => {
    (trackValue.length === 0 && setstepsArr(placed_status)) ||
      setactiveStepValue(0);
  }, [trackValue]);

  const [dashboard_details, setdashboard_details] = useState({
    delivered_orders: 0,
    received_orders: 0,
    total_customer: 0,
    net_earning: 0,
  });

  const _dashboard = () => {
    setloading(true);
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      restaurant: userDetails?.user?.restaurant?._id,
    });
    var config = {
      method: 'post',
      url: BASE_URL + PATH.DASHBOARD,
      headers: {},
      data: userDetails?.user?.admin_type === 'MANAGER' ? data : {},
    };

    axios(config)
      .then(function (response: any) {
        console.log(JSON.stringify(response.data));
        setloading(false);
        if (response.data.status) {
          console.log(response.data.data, '-------->>>>>>');
          setdashboard_details(response.data.data);
        } else {
        }
      })
      .catch(function (error: any) {
        console.log(error);
        setloading(false);
      });
  };

  useEffect(() => {
    _dashboard();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const _order_list = () => {
    setloading(true);
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({});
    var config = {
      method: 'post',
      url: BASE_URL + PATH.LIST_OF_ORDERS,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };

    axios(config)
      .then(function (response: any) {
        // console.log(JSON.stringify(response.data));
        setloading(false);
        if (response.data.status) {
          if (
            userDetails.user.admin_type === 'MANAGER' ||
            userDetails.user.admin_type === 'WAITER'
          ) {
            let restaurant_by_order_list = response.data.data.filter(
              (a: any) => a.restaurant._id === userDetails.user.restaurant._id
            );
            setorderList(restaurant_by_order_list.reverse());
          } else if (userDetails.user.admin_type === 'SUPER') {
            setorderList(response.data.data.reverse());
          } else {
          }
        }
      })
      .catch(function (error: any) {
        console.log(error);
        setloading(false);
      });
  };

  const fetchOrderList = async (pageNumber: number, pageLimit: number = 10) => {
    try {
      let url: any = BASE_URL + PATH.PAGINATED_LIST_OF_ORDERS + `?page=${pageNumber}&limit=${pageLimit}`;
      let body: any = {search: ''};

      if (userDetails?.user?.admin_type !== 'SUPER') {
        body.restaurant = userDetails?.user?.restaurant?._id;
      }

      setloading(true);

      const {data: orderData} = await axios.post(url, body);
      let filteredOrders = orderData?.data;

      if (userDetails?.user.admin_type === 'CHEF') {
        filteredOrders = filteredOrders.filter((b:any)=>b?.chef?._id === userDetails?.user._id)
      }

      setRecentOrderList(filteredOrders);
    } catch (error) {
        console.log(error);
    } finally {
      setloading(false);
    }
  }

  const fetchAllOrders = async () => {
    try {
      let url: any = BASE_URL;
      let body: any = {};

      if (userDetails?.user?.admin_type !== 'SUPER') {
        url += PATH.RESTAURANT_BY_ORDER_LIST;
        body.restaurant = userDetails?.user?.restaurant?._id;
      } else {
        url += PATH.LIST_OF_ORDERS;
      }

      //setloading(true);

      const {data: orderData} = await axios.post(url, body);
      let filteredOrders = orderData?.data;

      if (userDetails?.user.admin_type === 'CHEF') {
        filteredOrders = filteredOrders.filter((b:any)=>b?.chef?._id === userDetails?.user._id)
      }

      setorderList(filteredOrders);
    } catch (error) {
        console.log(error);
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    // _order_list();
    // console.log(orderList);
    fetchOrderList(0, 10).then(() => {
      fetchAllOrders();
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  const _listOfUsers = () => {
    setloading(true);
    var axios = require('axios');
    var qs = require('qs');
    var config = {
      method: 'post',
      url: BASE_URL + PATH.LIST_OF_USERS,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    axios(config)
      .then(function (response: any) {
        setloading(false);
        // console.log(JSON.stringify(response.data));
        if (response.data.status) {
          setUsersList(response.data.data);
        } else {
        }
      })
      .catch(function (error: any) {
        setloading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    _listOfUsers();
  }, []);

  useEffect(() => {
    let tempData: any[] = [];
    let mapper = today;
    interface ADD {
      [key: string]: {
        name: 'hours' | 'days' | 'weeks' | 'months' | 'years';
        value: number;
      };
    }
    type ACT = 'day' | 'week' | 'month' | 'year';
    let act: ACT = 'day';
    let add: ADD = {
      day: {
        name: 'days',
        value: 1,
      },
      week: {
        name: 'weeks',
        value: 1,
      },
      month: {
        name: 'months',
        value: 1,
      },
      year: {
        name: 'years',
        value: 1,
      },
    };

    if (activity == '10') {
      mapper = today;
      act = 'day';
    } else if (activity == '20') {
      mapper = weekly;
      act = 'week';
    } else if (activity == '30') {
      mapper = monthly;
      act = 'month';
    } else {
      mapper = yearly;
      act = 'year';
    }

    mapper.forEach((item, index) => {
      const orders = orderList?.filter((o: any) => {
        const cat = moment(o?.created_at);
        return cat.isAfter(item.from) && cat.isBefore(item.to);
      });
      // const users = usersList.filter((o: any) => {
      //   const cat = moment(o.created_at);
      //   return cat.isAfter(item.from) && cat.isBefore(item.to);
      // });

      const users = Array.from(new Set(orders?.map((o: any) => o?.user?._id)));

      tempData.push({
        name: item.name,
        uv: users.length,
        pv: orders.length,
      });
    });

    const orders = orderList?.filter((o: any) => {
      const cat = moment(o?.created_at);
      const from = moment().startOf(act);
      const to = moment().startOf(act).add(add[act].value, add[act].name);
      return cat.isAfter(from) && cat.isBefore(to);
    });

    const newUsers = Array.from(new Set(orders?.map((o: any) => o?.user?._id)));

    setdashboard_details((prev) => {
      return { ...prev, total_customer: newUsers.length };
    });

    setChartData(tempData);
  }, [orderList, usersList, activity]);

  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider theme={theme}>
        <Grid
          item
          lg={12}
          container
          style={{ backgroundColor: _.colors.colorWhite, padding: 10 }}
        >
          <Grid lg={12} sm={12} md={12} xs={12}>
            <a
              style={{
                color: _.colors.colorBlack,
                fontSize: '20px',
                fontWeight: 'normal',
                marginLeft: 10,
              }}
              target='_self'
              data-uia='login-help-link'
            >
              Restaurant
            </a>
          </Grid>
          {/* Order Delivered */}
          <Grid lg={3} sm={6} md={6} xs={12} style={{ padding: 10 }}>
            <div
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                backgroundColor: '#3291FF',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 20,
                paddingBottom: 20,
                borderRadius: 6,
              }}
            >
              <AiOutlineDropbox color={_.colors.colorWhite} size={42} />
              <div
                style={{
                  flexDirection: 'column',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <a
                  style={{
                    color: _.colors.colorWhite,
                    fontSize: '20px',
                    fontWeight: 'normal',
                  }}
                  target='_self'
                  data-uia='login-help-link'
                >
                  Order Delivered
                </a>
                <a
                  style={{
                    color: _.colors.colorWhite,
                    fontSize: '24px',
                    fontWeight: 'normal',
                    padding: 4,
                  }}
                  target='_self'
                  data-uia='login-help-link'
                >
                  {dashboard_details.delivered_orders}
                </a>
              </div>
            </div>
          </Grid>
          {/* Order Received */}
          <Grid lg={3} sm={6} md={6} xs={12} style={{ padding: 10 }}>
            <div
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                backgroundColor: '#FF5064',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 20,
                paddingBottom: 20,
                borderRadius: 6,
              }}
            >
              <BsCheck2Circle color={_.colors.colorWhite} size={42} />
              <div
                style={{
                  flexDirection: 'column',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <a
                  style={{
                    color: _.colors.colorWhite,
                    fontSize: '20px',
                    fontWeight: 'normal',
                  }}
                  target='_self'
                  data-uia='login-help-link'
                >
                  Order Received
                </a>
                <a
                  style={{
                    color: _.colors.colorWhite,
                    fontSize: '24px',
                    fontWeight: 'normal',
                    padding: 4,
                  }}
                  target='_self'
                  data-uia='login-help-link'
                >
                  {dashboard_details.received_orders}
                </a>
              </div>
            </div>
          </Grid>
          {/* New Customer */}
          <Grid lg={3} sm={6} md={6} xs={12} style={{ padding: 10 }}>
            <div
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                backgroundColor: '#FFA532',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 20,
                paddingBottom: 20,
                borderRadius: 6,
              }}
            >
              <AiOutlineUserAdd color={_.colors.colorWhite} size={42} />
              <div
                style={{
                  flexDirection: 'column',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <a
                  style={{
                    color: _.colors.colorWhite,
                    fontSize: '20px',
                    fontWeight: 'normal',
                  }}
                  target='_self'
                  data-uia='login-help-link'
                >
                  New Customer
                </a>
                <a
                  style={{
                    color: _.colors.colorWhite,
                    fontSize: '24px',
                    fontWeight: 'normal',
                    padding: 4,
                  }}
                  target='_self'
                  data-uia='login-help-link'
                >
                  {dashboard_details.total_customer}
                </a>
              </div>
            </div>
          </Grid>
          {/* Net Earnings */}
          <Grid lg={3} sm={6} md={6} xs={12} style={{ padding: 10 }}>
            <div
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                backgroundColor: '#32D2BE',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 20,
                paddingBottom: 20,
                borderRadius: 6,
              }}
            >
              <IoWalletOutline color={_.colors.colorWhite} size={42} />
              <div
                style={{
                  flexDirection: 'column',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <a
                  style={{
                    color: _.colors.colorWhite,
                    fontSize: '20px',
                    fontWeight: 'normal',
                  }}
                  target='_self'
                  data-uia='login-help-link'
                >
                  Net Earnings
                </a>
                <a
                  style={{
                    color: _.colors.colorWhite,
                    fontSize: '24px',
                    fontWeight: 'normal',
                    padding: 4,
                  }}
                  target='_self'
                  data-uia='login-help-link'
                >
                  {'₹' + dashboard_details.net_earning.toLocaleString()}
                </a>
              </div>
            </div>
          </Grid>
          {/* Daily Activity */}
          <Grid
            lg={10.5}
            sm={10}
            md={6}
            xs={12}
            style={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 20,
              marginTop: 20,
            }}
          >
            <a
              style={{
                color: _.colors.colorBlack,
                fontSize: '20px',
                fontWeight: 'normal',
              }}
              target='_self'
              data-uia='login-help-link'
            >
              Daily Activity
            </a>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GoPrimitiveDot size={20} color={_.colors.colorGreen} />
                <Typography
                  variant='h6'
                  sx={{ fontSize: 13, color: _.colors.colorTitle }}
                  component='div'
                >
                  Product Sold
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}
              >
                <GoPrimitiveDot size={22} color={'#FFA532'} />
                <Typography
                  variant='h6'
                  sx={{ fontSize: 13, color: _.colors.colorTitle }}
                  component='div'
                >
                  Total Customer
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            lg={1.5}
            sm={2}
            md={6}
            xs={12}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: 20,
            }}
          >
            <FormControl color='secondary' sx={{ width: 120, marginRight: 1 }}>
              <InputLabel>Select</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={activity}
                label='Select'
                size='small'
                onChange={handleChange}
              >
                <MenuItem value={10}>Today</MenuItem>
                <MenuItem value={20}>Weekly</MenuItem>
                <MenuItem value={30}>Monthly</MenuItem>
                <MenuItem value={40}>Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Live Chart */}
          <Grid
            lg={6}
            sm={6}
            md={6}
            xs={12}
            style={{ display: 'flex', alignItems: 'center', marginTop: 20, overflowX: 'auto' }}
          >
            <ResponsiveContainer width={'100%'} height={300}>
              <AreaChart
                width={500}
                height={300}
                data={chartData}
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <defs>
                  <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#FFA532' stopOpacity={0.4} />
                    <stop offset='95%' stopColor='#FFA532' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset='5%'
                      stopColor={_.colors.colorGreen}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset='95%'
                      stopColor={_.colors.colorGreen}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey='name'
                  axisLine={{ stroke: '#EAF0F4' }}
                  tickLine={false}
                  fontSize={14}
                />
                <YAxis
                  fontSize={14}
                  axisLine={{ stroke: '#EAF0F4' }}
                  tickLine={false}
                />
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                {/* <Tooltip /> */}
                <Area
                  type='monotone'
                  dataKey='uv'
                  stroke='#FFA532'
                  fillOpacity={1}
                  fill='url(#colorUv)'
                />
                <Area
                  type='monotone'
                  dataKey='pv'
                  stroke={_.colors.colorGreen}
                  fillOpacity={1}
                  fill='url(#colorPv)'
                />
              </AreaChart>
            </ResponsiveContainer>
          </Grid>
          <Grid
            lg={6}
            sm={6}
            md={6}
            xs={12}
            style={{ display: 'flex', alignItems: 'center', marginTop: 20, overflowX: 'auto' }}
          >
            <ResponsiveContainer width={'100%'} height={300}>
              <BarChart
                width={500}
                height={300}
                data={chartData}
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis
                  fontSize={14}
                  axisLine={{ stroke: '#EAF0F4' }}
                  tickLine={false}
                  dataKey='name'
                />
                <YAxis
                  fontSize={14}
                  axisLine={{ stroke: '#EAF0F4' }}
                  tickLine={false}
                />
                {/* <Tooltip />
          <Legend /> */}
                <Bar dataKey='pv' fill={_.colors.colorGreen} />
                <Bar dataKey='uv' fill={'#FFA532'} />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          {/* Track Order */}
          <Grid
            lg={12}
            sm={12}
            md={12}
            xs={12}
            style={{ padding: 10, marginTop: 20 }}
          >
            <a
              style={{
                color: _.colors.colorBlack,
                fontSize: '20px',
                fontWeight: 'normal',
              }}
              target='_self'
              data-uia='login-help-link'
            >
              Track Order
            </a>
          </Grid>
          <Grid
            lg={6}
            sm={6}
            md={6}
            xs={12}
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TextField
              value={trackValue}
              onChange={(prop) => settrackValue(prop.target.value)}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
              }}
              style={{ width: '60%' }}
              id='outlined-multiline-flexible'
              label='Order ID'
              color='secondary'
              size='small'
            />
            <Button
              onClick={() => _trackOrder(trackValue)}
              sx={{
                width: '20%',
                marginLeft: 2,
                backgroundColor: _.colors.colorOrange,
                ':hover': { backgroundColor: '#E16512' },
              }}
              variant='contained'
            >
              Track
            </Button>
          </Grid>
          <Grid lg={6} sm={6} md={6} xs={12} style={{ padding: 10 }}>
            <Stepper
              color='secondary'
              activeStep={activeStepValue}
              alternativeLabel
            >
              {stepsArr.map((label, index) => (
                <Step
                  sx={{
                    '& .MuiStepLabel-root .Mui-completed': {
                      color: _.colors.colorOrange, // circle color (COMPLETED)
                    },
                    '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                      {
                        color: _.colors.colorOrange, // Just text label (COMPLETED)
                      },
                    '& .MuiStepLabel-root .Mui-active': {
                      color: _.colors.colorOrange, // circle color (ACTIVE)
                    },
                    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                      {
                        color: _.colors.colorOrange, // Just text label (ACTIVE)
                      },
                    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                      fill: _.colors.colorWhite, // circle's number (ACTIVE)
                    },
                  }}
                  key={label.id}
                  completed={completed[index]}
                >
                  <StepButton disableRipple>{label.name}</StepButton>
                </Step>
              ))}
            </Stepper>
          </Grid>
          {/* Recently Placed Order */}
          <Grid
            lg={12}
            sm={12}
            md={12}
            xs={12}
            style={{ padding: 10, marginTop: 20 }}
          >
            <a
              style={{
                color: _.colors.colorBlack,
                fontSize: '20px',
                fontWeight: 'normal',
              }}
              target='_self'
              data-uia='login-help-link'
            >
              Recently Placed Order
            </a>
          </Grid>
          <Grid
            lg={12}
            sm={12}
            md={12}
            xs={12}
            style={{ padding: 10, marginBottom: '10%' }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow style={{ backgroundColor: _.colors.colorOrange }}>
                    <TableCell
                      align='center'
                      style={{ fontSize: 15, color: _.colors.colorWhite }}
                    >
                      Order id
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{ fontSize: 15, color: _.colors.colorWhite }}
                    >
                      {' '}
                      Date & time
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{ fontSize: 15, color: _.colors.colorWhite }}
                    >
                      Customer Name
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{ fontSize: 15, color: _.colors.colorWhite }}
                    >
                      Payment
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{ fontSize: 15, color: _.colors.colorWhite }}
                    >
                      Table
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{ fontSize: 15, color: _.colors.colorWhite }}
                    >
                      Order Type
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{ fontSize: 15, color: _.colors.colorWhite }}
                    >
                      Order Status
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{ fontSize: 15, color: _.colors.colorWhite }}
                    >
                      Price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrderList.map((item: any, index: any) => (
                    <TableRow
                      sx={{
                        backgroundColor: _.colors.colorWhite,
                        borderBottomColor: _.colors.colorLightGray,
                        borderBottomWidth: '1px',
                      }}
                      key={index + 1}
                    >
                      <TableCell
                        align='center'
                        sx={{ padding: 1 }}
                        style={{ color: _.colors.colorFacebook }}
                      >
                        {item?.order_id}
                      </TableCell>
                      {/* <TableCell align='center' sx={{padding:1}}>{moment(item?.order_date_and_time).format('D MMMM YYYY, h:mm:ss a')}</TableCell> */}
                      <TableCell align='center' sx={{ padding: 1 }}>
                        {<DateTimeView item={item} />}
                      </TableCell>
                      <TableCell align='center' sx={{ padding: 1 }}>
                        {<UserNameView item={item} />}
                      </TableCell>
                      <TableCell align='center' sx={{ padding: 1 }}>
                        {<PaymentStatusView item={item} />}
                      </TableCell>
                      <TableCell align='center' sx={{ padding: 1 }}>
                        <Typography
                          variant='caption'
                          sx={{
                            minWidth: '80px',
                            fontSize: 14,
                            color: _.colors.colorBlack,
                          }}
                          component='div'
                        >
                          {item?.table?.table_no}
                        </Typography>
                      </TableCell>
                      <TableCell align='center' sx={{ padding: 1 }}>
                        {<OrderTypeView item={item} />}
                      </TableCell>
                      <TableCell align='center' sx={{ padding: 1 }}>
                        {<OrderStatusView item={item} />}
                      </TableCell>
                      <TableCell align='center'>₹{item.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            autoHideDuration={3000}
            onClose={snackbarClose}
            key={vertical + horizontal}
          >
            <Alert
              onClose={snackbarClose}
              severity={type}
              sx={{ width: '100%' }}
            >
              {message}
            </Alert>
          </Snackbar>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
        </Grid>
      </ThemeProvider>
    </Box>
  );
}
