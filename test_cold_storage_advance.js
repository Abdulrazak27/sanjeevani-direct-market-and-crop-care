const http = require("http");

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, text: body });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log("================================================================");
  console.log("SANJEEVANI: COLD STORAGE 20% ADVANCE PAYMENT SYSTEM TEST SUITE");
  console.log("================================================================\n");

  // 1. Math Formula Verification
  console.log("TEST 1: Dynamic 20% Calculation Verification");
  const testCases = [
    { total: 10000, expectedAdvance: 2000, expectedRemaining: 8000 },
    { total: 25000, expectedAdvance: 5000, expectedRemaining: 20000 },
    { total: 5000, expectedAdvance: 1000, expectedRemaining: 4000 },
    { total: 50000, expectedAdvance: 10000, expectedRemaining: 40000 }
  ];

  for (const tc of testCases) {
    const advance = Math.round(tc.total * 0.20);
    const remaining = tc.total - advance;
    if (advance !== tc.expectedAdvance || remaining !== tc.expectedRemaining) {
      throw new Error(`Formula check failed for total ₹${tc.total}: expected adv ₹${tc.expectedAdvance}, got ₹${advance}`);
    }
    console.log(`  ✓ Total: ₹${tc.total.toLocaleString()} -> 20% Advance: ₹${advance.toLocaleString()}, Remaining: ₹${remaining.toLocaleString()}`);
  }

  // 2. Fetch Existing Bookings
  console.log("\nTEST 2: GET /api/cold-storage/bookings");
  const getRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/cold-storage/bookings",
    method: "GET"
  });
  if (getRes.status !== 200 || !Array.isArray(getRes.data)) {
    throw new Error(`Failed to retrieve bookings, status: ${getRes.status}`);
  }
  console.log(`  ✓ Retrieved ${getRes.data.length} cold storage bookings`);

  // 3. Create a New Cold Storage Booking
  console.log("\nTEST 3: POST /api/cold-storage/bookings (Dynamic 20% auto-calc)");
  const newBookingPayload = {
    facility_id: "STR_401",
    facility_name: "Sri Lakshmi Agro Cold Storage",
    location: "NH-16 Bypass Road, Guntur",
    farmer_id: "FAR_201",
    farmer_name: "Ramesh Kumar",
    farmer_phone: "+91 9876543210",
    crop_name: "Tomato (Hybrid Grade A)",
    quantity_mt: 10.0,
    duration_days: 30,
    daily_rate_qtl: 12.0,
    total_amount: 10000.0
  };

  const createRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/cold-storage/bookings",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, newBookingPayload);

  if (createRes.status !== 201 || !createRes.data.id) {
    throw new Error(`Failed to create booking, status: ${createRes.status}`);
  }
  const createdBooking = createRes.data;
  console.log(`  ✓ Created Booking ID: ${createdBooking.id} (${createdBooking.booking_code})`);
  console.log(`    Total Amount: ₹${createdBooking.total_amount}`);
  console.log(`    Required 20% Advance: ₹${createdBooking.required_advance}`);
  console.log(`    Payment Status: ${createdBooking.payment_status}`);
  console.log(`    Remaining Amount: ₹${createdBooking.remaining_amount}`);

  if (createdBooking.required_advance !== 2000 || createdBooking.remaining_amount !== 10000) {
    throw new Error("Invalid calculation on created booking");
  }

  // 4. Pay the 20% Advance
  console.log("\nTEST 4: POST /api/cold-storage/bookings/pay-advance (Execute 20% Advance Payment)");
  const payRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/cold-storage/bookings/pay-advance",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    booking_id: createdBooking.id,
    amount: 2000.0,
    payment_method: "UPI Instant Pay"
  });

  if (payRes.status !== 200 || !payRes.data.success) {
    throw new Error(`Failed to execute advance payment, status: ${payRes.status}: ${JSON.stringify(payRes.data)}`);
  }
  const paidBooking = payRes.data.booking;
  console.log(`  ✓ Payment Successful!`);
  console.log(`    Status Updated: ${paidBooking.payment_status}`);
  console.log(`    Amount Paid: ₹${paidBooking.amount_paid}`);
  console.log(`    Remaining Due: ₹${paidBooking.remaining_amount}`);
  console.log(`    Txn ID: ${paidBooking.txn_id}`);
  console.log(`    Payment Date: ${paidBooking.payment_date}`);

  if (paidBooking.payment_status !== "20% Advance Paid" || paidBooking.remaining_amount !== 8000) {
    throw new Error("Post-payment state validation failed");
  }

  // 5. Test Duplicate Payment Prevention
  console.log("\nTEST 5: Duplicate Payment Prevention Test");
  const dupRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/cold-storage/bookings/pay-advance",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    booking_id: createdBooking.id,
    amount: 2000.0,
    payment_method: "UPI Instant Pay"
  });

  if (dupRes.status === 400 && dupRes.data.error.includes("already been paid")) {
    console.log(`  ✓ Duplicate payment correctly blocked with HTTP 400: "${dupRes.data.error}"`);
  } else {
    throw new Error(`Duplicate payment was not blocked properly: status ${dupRes.status}`);
  }

  // 6. Test GET /api/sync/all reflects storage_bookings
  console.log("\nTEST 6: Unified State Sync (/api/sync/all)");
  const syncRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/sync/all",
    method: "GET"
  });
  if (syncRes.status !== 200 || !Array.isArray(syncRes.data.storage_bookings)) {
    throw new Error("Unified sync endpoint does not return storage_bookings");
  }
  const found = syncRes.data.storage_bookings.find(b => b.id === createdBooking.id);
  if (!found || found.payment_status !== "20% Advance Paid") {
    throw new Error("Synced data does not contain paid booking");
  }
  console.log(`  ✓ Unified sync verified! Total bookings in DB: ${syncRes.data.storage_bookings.length}`);

  console.log("\n================================================================");
  console.log("ALL COLD STORAGE 20% ADVANCE PAYMENT TESTS PASSED (100% SUCCESS)");
  console.log("================================================================\n");
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
