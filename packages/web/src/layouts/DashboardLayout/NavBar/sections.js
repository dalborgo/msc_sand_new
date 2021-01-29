import {
  List as ListIcon,
  FilePlus as FilePlusIcon,
} from 'react-feather'

const sections = [
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
]

export default sections
