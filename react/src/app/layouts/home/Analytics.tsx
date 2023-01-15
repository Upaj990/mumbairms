import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  FormControl,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { BASE_URL, PATH } from '../../api';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const initialOptionsState: any = () => ({
  restaurantList: [],
  categoryList: [],
  menuList: [],
});

const initialUserInputState: any = () => ({
  restaurant: '',
  category: '',
  menu: '',
});

const initialCategoryCard: any = () => ({
  name: 'N/A',
  orders: [],
  chartData: [],
  totalAmount: 0,
  totalQuantity: 0,
});

const initialMenuCardState: any = () => ({
  name: 'N/A',
  orders: [],
  chartData: [],
  totalAmount: 0,
  totalQuantity: 0,
});

const initialMonthData: any = () => ({
  name: moment().month() + 1,
  data: {
    orders: [],
    totalAmount: 0,
    totalQuantity: 0,
  },
});

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

const yesterday = [
  {
    name: '12 AM',
    from: moment().startOf('day').subtract(1, 'days'),
    to: moment().startOf('day').subtract(1, 'days').add(3, 'hours'),
  },
  {
    name: '3 AM',
    from: moment().startOf('day').subtract(1, 'days').add(3, 'hours'),
    to: moment().startOf('day').subtract(1, 'days').add(6, 'hours'),
  },
  {
    name: '6 AM',
    from: moment().startOf('day').subtract(1, 'days').add(6, 'hours'),
    to: moment().startOf('day').subtract(1, 'days').add(9, 'hours'),
  },
  {
    name: '9 AM',
    from: moment().startOf('day').subtract(1, 'days').add(9, 'hours'),
    to: moment().startOf('day').subtract(1, 'days').add(12, 'hours'),
  },
  {
    name: '12 PM',
    from: moment().startOf('day').subtract(1, 'days').add(12, 'hours'),
    to: moment().startOf('day').subtract(1, 'days').add(15, 'hours'),
  },
  {
    name: '3 PM',
    from: moment().startOf('day').subtract(1, 'days').add(15, 'hours'),
    to: moment().startOf('day').subtract(1, 'days').add(18, 'hours'),
  },
  {
    name: '6 PM',
    from: moment().startOf('day').subtract(1, 'days').add(18, 'hours'),
    to: moment().startOf('day').subtract(1, 'days').add(21, 'hours'),
  },
  {
    name: '12 PM',
    from: moment().startOf('day').subtract(1, 'days').add(21, 'hours'),
    to: moment().startOf('day').subtract(1, 'days').add(24, 'hours'),
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

const rangeOptions = [
  {
    id: 0,
    name: 'Yesterday',
  },
  {
    id: 1,
    name: 'Today',
  },
  {
    id: 2,
    name: 'Weekly',
  },
  {
    id: 3,
    name: 'Monthly',
  },
  {
    id: 4,
    name: 'Yearly',
  },
  {
    id: 5,
    name: 'All Time',
  },
];

const monthOptions = [
  {
    id: 1,
    name: 'January',
  },
  {
    id: 2,
    name: 'February',
  },
  {
    id: 3,
    name: 'March',
  },
  {
    id: 4,
    name: 'April',
  },
  {
    id: 5,
    name: 'May',
  },
  {
    id: 6,
    name: 'June',
  },
  {
    id: 7,
    name: 'July',
  },
  {
    id: 8,
    name: 'August',
  },
  {
    id: 9,
    name: 'September',
  },
  {
    id: 10,
    name: 'October',
  },
  {
    id: 11,
    name: 'November',
  },
  {
    id: 12,
    name: 'December',
  },
];

function SelectInput(props: any) {
  return (
    <FormControl fullWidth size='small' disabled={props.disabled ?? false}>
      <InputLabel id={props.label}>{props.label}</InputLabel>
      <Select
        labelId={props.label}
        label={props.label}
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
      >
        {props?.options.map((option: any) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function Card(props: any) {
  return (
    <Box
      sx={{
        p: 4,
        boxShadow: 2,
        color: 'white',
        borderRadius: 2,
        textAlign: 'center',
        background: props.bg,
        width: { xs: 'auto', sm: '100%' },
      }}
    >
      <Typography>{props.label}</Typography>
      <Typography>{props.value}</Typography>
    </Box>
  );
}

export default function Analytics() {
  const { userDetails } = useSelector((state: any) => state);
  const [userInput, setUserInput] = useState<any>(initialUserInputState);
  const [optionData, setOptionData] = useState<any>(initialOptionsState);
  const [categoryData, setCategoryData] = useState<any>(initialCategoryCard);
  const [menuData, setMenuData] = useState<any>(initialMenuCardState);
  const [orders, setOrders] = useState<any>([]);
  const [categoryRange, setCategoryRange] = useState<any>(1);
  const [menuRange, setMenuRange] = useState<any>(1);
  const [monthData, setMonthData] = useState<any>(initialMonthData);
  const [loading, setLoading] = useState<any>(false);

  const alltime = useMemo(() => {
    const mapper = [];
    const currentYear = moment().year();

    const earliestDateJS = new Date(
      Math.max(...orders.map((o: any) => new Date(o.created_at)))
    );
    const earliestYear = moment(earliestDateJS).year();

    for (let i = earliestYear; i <= currentYear; i++) {
      const mapperObj = {
        name: i,
        from: moment().startOf('year').set('year', i),
        to: moment().startOf('year').set('year', i).add(1, 'years'),
      };

      mapper.push(mapperObj);
    }

    return mapper;
  }, [orders]);

  const todaysTotal = useMemo(() => {
    const mapper = {
      from: moment().startOf('day'),
      to: moment().startOf('day').add(1, 'days'),
    };

    const todayOrders = orders.filter((o: any) => {
      const cat = moment(o.created_at);
      return cat.isAfter(mapper.from) && cat.isBefore(mapper.to);
    });

    const foodItemsWithMenu = todayOrders.map((o: any) => o?.food_items).flat();

    const totalAmountAndQuantity = foodItemsWithMenu.reduce(
      (total: any, currentFoodItem: any) => {
        total.quantity += currentFoodItem?.quantity;
        total.amount += currentFoodItem?.price * currentFoodItem?.quantity;
        return total;
      },
      {
        amount: 0,
        quantity: 0,
      }
    );

    return totalAmountAndQuantity;
    return;
  }, [orders]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserInput((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCategoryRange = (e: any) => {
    const { value } = e.target;
    setCategoryRange(value);
  };

  const handleMenuRange = (e: any) => {
    const { value } = e.target;
    setMenuRange(value);
  };

  const handleMonthData = (e: any) => {
    const { name, value } = e.target;
    setMonthData((prev: any) => ({ ...prev, [name]: value }));
  };

  const fetchOptionList = async ({ path, restaurant }: any) => {
    try {
      setLoading(true);
      const res = await axios.post(BASE_URL + path, {
        restaurant,
      });
      return res.data.data;
    } catch (error) {
      console.log((error as any).response);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      let url = BASE_URL;

      if (userInput.restaurant) {
        url = url.concat(PATH.RESTAURANT_BY_ORDER_LIST);
      } else {
        url = url.concat(PATH.LIST_OF_ORDERS);
      }

      const res = await axios.post(url, {
        restaurant: userInput.restaurant,
      });
      return res.data.data;
    } catch (error) {
      console.log((error as any).response);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders
  useEffect(() => {
    fetchOrders().then((data) => setOrders(data));
  }, [userInput.restaurant]);

  // User details
  useEffect(() => {
    if (userDetails?.user?.admin_type === 'MANAGER') {
      setUserInput((prev: any) => ({
        ...prev,
        restaurant: userDetails?.user?.restaurant?._id,
      }));
    }
  }, [userDetails]);

  // Fetch restaurant list
  useEffect(() => {
    fetchOptionList({ path: PATH.LIST_OF_RESTAURANT }).then((data) => {
      setOptionData((prev: any) => ({
        ...prev,
        restaurantList: data.map((d: any) => {
          return {
            id: d._id,
            name: d.restaurant_name,
          };
        }),
      }));
    });
  }, []);

  // Fetch category list
  useEffect(() => {
    let url = userInput.restaurant
      ? PATH.RESRAURANT_BY_MENU_LIST
      : PATH.LIST_OF_MENU;

    let restaurant = userInput.restaurant;

    if (userDetails?.user?.admin_type === 'MANAGER') {
      url = PATH.RESRAURANT_BY_MENU_LIST;
      restaurant = userDetails?.user?.restaurant?._id;
    }

    fetchOptionList({ path: url, restaurant }).then((data) => {
      let categories = Array.from(
        new Set(data.map((d: any) => d?.category?._id))
      );

      categories = categories.map((c: any) => {
        const menuItem = data.find((x: any) => x?.category?._id === c);
        return {
          id: menuItem?.category?._id,
          name: menuItem?.category?.name,
        };
      });

      setOptionData((prev: any) => ({ ...prev, categoryList: categories }));
    });
  }, [userInput.restaurant, userDetails]);

  // Fetch menu list
  useEffect(() => {
    let url = userInput.restaurant
      ? PATH.RESRAURANT_BY_MENU_LIST
      : PATH.LIST_OF_MENU;

    let restaurant = userInput?.restaurant;

    if (userDetails?.user?.admin_type === 'MANAGER') {
      url = PATH.RESRAURANT_BY_MENU_LIST;
      restaurant = userDetails?.user?.restaurant?._id;
    }

    fetchOptionList({ path: url, restaurant }).then((data) => {
      setOptionData((prev: any) => ({
        ...prev,
        menuList: data.map((d: any) => {
          return {
            id: d._id,
            name: d.menu_name,
          };
        }),
      }));
    });
  }, [userInput.restaurant, userDetails]);

  // Set category data
  useEffect(() => {
    let mapper: any = today;

    if (categoryRange === 0) {
      mapper = yesterday;
    } else if (categoryRange === 1) {
      mapper = today;
    } else if (categoryRange === 2) {
      mapper = weekly;
    } else if (categoryRange === 3) {
      mapper = monthly;
    } else if (categoryRange === 4) {
      mapper = yearly;
    } else {
      mapper = alltime;
    }

    const selectedCategoryName = optionData?.categoryList.find(
      (c: any) => c.id === userInput.category
    )?.name;

    const ordersByCategory = orders.filter((o: any) =>
      o?.food_items.some((fi: any) => fi?.category?._id === userInput.category)
    );

    const ordersByTime = ordersByCategory.filter((o: any) => {
      const cat = moment(o.created_at);
      return (
        cat.isAfter(mapper[0].from) &&
        cat.isBefore(mapper[mapper.length - 1].to)
      );
    });

    const foodItemsWithCategory = ordersByTime
      .map((o: any) =>
        o?.food_items.filter(
          (fi: any) => fi?.category?._id === userInput.category
        )
      )
      .flat();

    const totalAmountAndQuantity = foodItemsWithCategory.reduce(
      (total: any, currentFoodItem: any) => {
        total.quantity += currentFoodItem?.quantity;
        total.amount += currentFoodItem?.price * currentFoodItem?.quantity;
        return total;
      },
      {
        amount: 0,
        quantity: 0,
      }
    );

    let tempData: any = { amount: [], quantity: [] };
    mapper.forEach((item: any, index: any) => {
      const rangeOrders = ordersByCategory.filter((o: any) => {
        const cat = moment(o.created_at);
        return cat.isAfter(item.from) && cat.isBefore(item.to);
      });

      const fiwc = rangeOrders
        .map((o: any) =>
          o?.food_items.filter(
            (fi: any) => fi?.category?._id === userInput.category
          )
        )
        .flat();

      const taq = fiwc.reduce(
        (total: any, currentFoodItem: any) => {
          total.quantity += currentFoodItem?.quantity;
          total.amount += currentFoodItem?.price * currentFoodItem?.quantity;
          return total;
        },
        {
          amount: 0,
          quantity: 0,
        }
      );

      tempData.amount.push({
        name: item.name,
        uv: taq.amount,
      });

      tempData.quantity.push({
        name: item.name,
        uv: taq.quantity,
      });
    });

    setCategoryData((prev: any) => ({
      ...prev,
      totalAmount: totalAmountAndQuantity.amount,
      totalQuantity: totalAmountAndQuantity.quantity,
      name: selectedCategoryName,
      orders: ordersByTime,
      chartData: tempData,
    }));
  }, [orders, userInput.category, categoryRange]);

  // Set menu data
  useEffect(() => {
    let mapper: any = today;

    if (menuRange === 0) {
      mapper = yesterday;
    } else if (menuRange === 1) {
      mapper = today;
    } else if (menuRange === 2) {
      mapper = weekly;
    } else if (menuRange === 3) {
      mapper = monthly;
    } else if (menuRange === 4) {
      mapper = yearly;
    } else {
      mapper = alltime;
    }

    const selectedMenuName = optionData?.menuList.find(
      (m: any) => m.id === userInput.menu
    )?.name;

    const ordersByMenu = orders.filter((o: any) =>
      o?.food_items.some((fi: any) => fi?.menu_name === selectedMenuName)
    );

    const ordersByTime = ordersByMenu.filter((o: any) => {
      const cat = moment(o.created_at);
      return (
        cat.isAfter(mapper[0].from) &&
        cat.isBefore(mapper[mapper.length - 1].to)
      );
    });

    const foodItemsWithMenu = ordersByTime
      .map((o: any) =>
        o?.food_items.filter((fi: any) => fi?.menu_name === selectedMenuName)
      )
      .flat();

    const totalAmountAndQuantity = foodItemsWithMenu.reduce(
      (total: any, currentFoodItem: any) => {
        total.quantity += currentFoodItem?.quantity;
        total.amount += currentFoodItem?.price * currentFoodItem?.quantity;
        return total;
      },
      {
        amount: 0,
        quantity: 0,
      }
    );

    let tempData: any = { amount: [], quantity: [] };
    mapper.forEach((item: any, index: any) => {
      const rangeOrders = ordersByMenu.filter((o: any) => {
        const cat = moment(o.created_at);
        return cat.isAfter(item.from) && cat.isBefore(item.to);
      });

      const fiwm = rangeOrders
        .map((o: any) =>
          o?.food_items.filter((fi: any) => fi?.menu_name === selectedMenuName)
        )
        .flat();

      const taq = fiwm.reduce(
        (total: any, currentFoodItem: any) => {
          total.quantity += currentFoodItem?.quantity;
          total.amount += currentFoodItem?.price * currentFoodItem?.quantity;
          return total;
        },
        {
          amount: 0,
          quantity: 0,
        }
      );

      tempData.amount.push({
        name: item.name,
        uv: taq.amount,
      });

      tempData.quantity.push({
        name: item.name,
        uv: taq.quantity,
      });
    });

    setMenuData((prev: any) => ({
      ...prev,
      totalAmount: totalAmountAndQuantity.amount,
      totalQuantity: totalAmountAndQuantity.quantity,
      name: selectedMenuName,
      orders: ordersByTime,
      chartData: tempData,
    }));
  }, [orders, userInput.menu, menuRange]);

  // Set month data
  useEffect(() => {
    let mapper = {
      from: moment()
        .startOf('year')
        .add(parseInt(monthData.name) - 1, 'months'),
      to: moment().startOf('year').add(parseInt(monthData.name), 'months'),
    };

    const ordersByTime = orders.filter((o: any) => {
      const cat = moment(o.created_at);
      return cat.isAfter(mapper.from) && cat.isBefore(mapper.to);
    });

    const foodItemsWithMenu = ordersByTime
      .map((o: any) => o?.food_items)
      .flat();

    const totalAmountAndQuantity = foodItemsWithMenu.reduce(
      (total: any, currentFoodItem: any) => {
        total.quantity += currentFoodItem?.quantity;
        total.amount += currentFoodItem?.price * currentFoodItem?.quantity;
        return total;
      },
      {
        amount: 0,
        quantity: 0,
      }
    );

    setMonthData((prev: any) => ({
      ...prev,
      data: {
        orders: ordersByTime,
        totalAmount: totalAmountAndQuantity.amount,
        totalQuantity: totalAmountAndQuantity.quantity,
      },
    }));
  }, [orders, monthData.name]);

  return (
    <Box sx={{ m: { xs: 2, sm: 0 } }}>
      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      {/* ///////////// */}
      {/* Select Inputs */}
      {/* ///////////// */}
      <Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <SelectInput
            {...{
              options: optionData.restaurantList,
              value: userInput.restaurant,
              name: 'restaurant',
              label: 'Restaurant',
              handleChange,
              disabled:
                userDetails?.user?.admin_type === 'MANAGER' ? true : false,
            }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={2}>
          <Card
            {...{
              label: `Today's Revenue`,
              value: `₹ ${todaysTotal.amount}`,
              bg: '#32d2be',
            }}
          />
        </Stack>
      </Box>
      {/* //////// */}
      {/* Category */}
      {/* //////// */}
      <Box pt={4}>
        <Typography>Category Wise Results</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={2}>
          <SelectInput
            {...{
              options: optionData.categoryList,
              value: userInput.category,
              name: 'category',
              label: 'Category',
              handleChange,
            }}
          />
          <SelectInput
            {...{
              options: rangeOptions,
              value: categoryRange,
              name: 'range',
              label: 'Range',
              handleChange: handleCategoryRange,
            }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={2}>
          <Card
            {...{
              label: 'Category Name',
              value: categoryData.name,
              bg: '#3291FF',
            }}
          />
          <Card
            {...{
              label: 'Total amount ordered',
              value: `₹ ${categoryData.totalAmount}`,
              bg: '#FF5064',
            }}
          />
          <Card
            {...{
              label: 'Total quantity',
              value: categoryData.totalQuantity,
              bg: '#FFA532',
            }}
          />
        </Stack>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          pt={4}
          overflow='auto'
          style={{ overflowY: 'hidden' }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography pb={2}>Amount</Typography>
            <BarChart
              width={500}
              height={300}
              data={categoryData?.chartData?.amount}
              margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Legend />
              <Tooltip />
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
              <Bar dataKey='uv' fill={'#FFA532'} />
            </BarChart>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography pb={2}>Quantity</Typography>
            <BarChart
              width={500}
              height={300}
              data={categoryData?.chartData?.quantity}
              margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Legend />
              <Tooltip />
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
              <Bar dataKey='uv' fill={'#00D75A'} />
            </BarChart>
          </Box>
        </Stack>
      </Box>
      {/* /////*/}
      {/* Menu */}
      {/* /////*/}
      <Box pt={4}>
        <Typography>Menu Wise Results</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={2}>
          <SelectInput
            {...{
              options: optionData.menuList,
              value: userInput.menu,
              name: 'menu',
              label: 'Menu',
              handleChange,
            }}
          />
          <SelectInput
            {...{
              options: rangeOptions,
              value: menuRange,
              name: 'range',
              label: 'Range',
              handleChange: handleMenuRange,
            }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={2}>
          <Card
            {...{
              label: 'Menu Name',
              value: menuData.name,
              bg: '#3291FF',
            }}
          />
          <Card
            {...{
              label: 'Total amount ordered',
              value: `₹ ${menuData.totalAmount}`,
              bg: '#FF5064',
            }}
          />
          <Card
            {...{
              label: 'Total quantity',
              value: menuData.totalQuantity,
              bg: '#FFA532',
            }}
          />
        </Stack>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          pt={4}
          overflow='auto'
          style={{ overflowY: 'hidden' }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography pb={2}>Amount</Typography>
            <BarChart
              width={500}
              height={300}
              data={menuData?.chartData?.amount}
              margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Legend />
              <Tooltip />
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
              <Bar dataKey='uv' fill={'#FFA532'} />
            </BarChart>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography pb={2}>Quantity</Typography>
            <BarChart
              width={500}
              height={300}
              data={menuData?.chartData?.quantity}
              margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Legend />
              <Tooltip />
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
              <Bar dataKey='uv' fill={'#00D75A'} />
            </BarChart>
          </Box>
        </Stack>
      </Box>
      {/* /////////////*/}
      {/* Month select */}
      {/* /////////////*/}
      <Box pt={4}>
        <Typography>Month Wise Results</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={2}>
          <SelectInput
            {...{
              options: monthOptions,
              value: monthData.name,
              name: 'name',
              label: 'Month',
              handleChange: handleMonthData,
            }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={2}>
          <Card
            {...{
              label: 'Total orders',
              value: monthData?.data?.orders?.length,
              bg: '#3291FF',
            }}
          />
          <Card
            {...{
              label: 'Total amount ordered',
              value: `₹ ${monthData?.data?.totalAmount}`,
              bg: '#FF5064',
            }}
          />
          <Card
            {...{
              label: 'Total quantity',
              value: monthData?.data?.totalQuantity,
              bg: '#FFA532',
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
}
