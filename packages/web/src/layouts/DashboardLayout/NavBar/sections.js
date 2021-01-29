import {
  List as ListIcon,
  FilePlus as FilePlusIcon,
} from 'react-feather'

const sections = [
  /*{
    subheader: 'home',
    items: [
      {
        title: 'Dashboard',
        icon: PieChartIcon,
        href: '/app/reports/dashboard',
      },
    ],
  },*/
  {
    subheader: 'certificates',
    items: [
      {
        title: 'certificate_list',
        icon: ListIcon,
        href: '/app/certificates/list',
      },
    ],
  },
  {
    subheader: 'bookings',
    items: [
      {
        title: 'new_booking',
        icon: FilePlusIcon,
        href: '/app/booking/new-booking',
      },
    ],
  },
]

export default sections
