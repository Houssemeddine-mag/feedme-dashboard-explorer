
export const restaurantData = [
  { 
    id: 1, 
    name: "HoussemHouse Downtown", 
    status: "open", 
    sales: 5320,
    director: "John Smith",
    email: "j.smith@houssemhouse.com",
    staffCount: 24,
    alertLevel: "low" as const
  },
  { 
    id: 2, 
    name: "HoussemHouse Riverside", 
    status: "open", 
    sales: 4780,
    director: "Emma Jones",
    email: "e.jones@houssemhouse.com",
    staffCount: 18,
    alertLevel: "medium" as const
  },
  { 
    id: 3, 
    name: "HoussemHouse Central Park", 
    status: "closed", 
    sales: 0,
    director: "Robert Wilson",
    email: "r.wilson@houssemhouse.com",
    staffCount: 22,
    alertLevel: "none" as const
  },
  { 
    id: 4, 
    name: "HoussemHouse Business District", 
    status: "open", 
    sales: 6120,
    director: "Sarah Miller",
    email: "s.miller@houssemhouse.com",
    staffCount: 30,
    alertLevel: "none" as const
  },
  { 
    id: 5, 
    name: "HoussemHouse Harbor View", 
    status: "closed", 
    sales: 0,
    director: "Michael Brown",
    email: "m.brown@houssemhouse.com",
    staffCount: 20,
    alertLevel: "high" as const
  },
];

export const staffingIssues = [
  { restaurant: "HoussemHouse Harbor View", position: "Chef", status: "Understaffed", priority: "High" },
  { restaurant: "HoussemHouse Downtown", position: "Waitstaff", status: "Shift Coverage", priority: "Medium" },
  { restaurant: "HoussemHouse Riverside", position: "Manager", status: "On Leave", priority: "Medium" },
];

export const operationalIssues = [
  { restaurant: "HoussemHouse Harbor View", issue: "Facility Maintenance", details: "HVAC system failure", priority: "High" },
  { restaurant: "HoussemHouse Business District", issue: "Director Absence", details: "Sarah Miller will be unavailable next week", priority: "Medium" },
  { restaurant: "HoussemHouse Central Park", issue: "Reopening Delayed", details: "Inspection pending", priority: "High" },
];
