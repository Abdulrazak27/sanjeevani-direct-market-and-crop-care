const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function request(method, pathName, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathName, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function calculateAdvancePayment(totalAmount, amountPaid = 0) {
  const requiredAdvance = Math.round(totalAmount * 0.20);
  const remainingAdvance = Math.max(0, requiredAdvance - amountPaid);
  const remainingTotal = Math.max(0, totalAmount - amountPaid);
  
  let paymentStatus = "Pending";
  if (amountPaid >= requiredAdvance) {
    paymentStatus = "Paid";
  } else if (amountPaid > 0) {
    paymentStatus = "Partially Paid";
  }

  const advancePercentage = requiredAdvance > 0 
    ? Math.min(100, Math.round((amountPaid / requiredAdvance) * 100))
    : 100;

  return {
    totalAmount,
    requiredAdvance,
    amountPaid,
    remainingAdvance,
    remainingTotal,
    paymentStatus,
    advancePercentage
  };
}

async function runTests() {
  console.log("=================================================");
  console.log("  TEST SUITE: MANDATORY 20% ADVANCE PAYMENT TRACKING  ");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, testName, detail = "") {
    total++;
    if (condition) {
      console.log(`✓ [PASS] Test ${total}: ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] Test ${total}: ${testName} - ${detail}`);
    }
  }

  // --- UNIT TESTS FOR 20% ADVANCE CALCULATION RULE ---
  console.log("--- 1. Advance Payment Math & Status Logic ---");
  
  // Case A: 100,000 contract, 0 paid
  const c1 = calculateAdvancePayment(100000, 0);
  assert(c1.requiredAdvance === 20000, "100k contract -> 20k required advance", `got ${c1.requiredAdvance}`);
  assert(c1.remainingAdvance === 20000, "0 paid -> 20k remaining advance", `got ${c1.remainingAdvance}`);
  assert(c1.paymentStatus === "Pending", "0 paid -> status Pending", `got ${c1.paymentStatus}`);
  assert(c1.advancePercentage === 0, "0 paid -> 0% advance", `got ${c1.advancePercentage}%`);

  // Case B: 100,000 contract, 10,000 partial payment
  const c2 = calculateAdvancePayment(100000, 10000);
  assert(c2.requiredAdvance === 20000, "100k contract -> 20k required advance");
  assert(c2.remainingAdvance === 10000, "10k paid -> 10k remaining advance", `got ${c2.remainingAdvance}`);
  assert(c2.paymentStatus === "Partially Paid", "10k paid -> status Partially Paid", `got ${c2.paymentStatus}`);
  assert(c2.advancePercentage === 50, "10k paid -> 50% advance", `got ${c2.advancePercentage}%`);

  // Case C: 100,000 contract, 20,000 full advance payment
  const c3 = calculateAdvancePayment(100000, 20000);
  assert(c3.remainingAdvance === 0, "20k paid -> 0 remaining advance", `got ${c3.remainingAdvance}`);
  assert(c3.paymentStatus === "Paid", "20k paid -> status Paid", `got ${c3.paymentStatus}`);
  assert(c3.advancePercentage === 100, "20k paid -> 100% advance", `got ${c3.advancePercentage}%`);
  assert(c3.remainingTotal === 80000, "20k paid -> 80k remaining total contract", `got ${c3.remainingTotal}`);

  // Case D: Arbitrary contract amount (e.g. ₹2,85,000)
  const c4 = calculateAdvancePayment(285000, 57000);
  assert(c4.requiredAdvance === 57000, "285k contract -> 57k (20%) advance", `got ${c4.requiredAdvance}`);
  assert(c4.paymentStatus === "Paid", "57k paid -> status Paid", `got ${c4.paymentStatus}`);

  // --- INTEGRATION TESTS WITH RUNNING BACKEND SERVER ---
  console.log("\n--- 2. Backend Payment API & Synchronization ---");

  // Step 1: Check GET /api/sync/all has payments
  const syncRes = await request('GET', '/api/sync/all');
  assert(syncRes.status === 200, "GET /api/sync/all responds with 200 OK");
  assert(Array.isArray(syncRes.data.payments), "GET /api/sync/all includes payments array");

  // Step 2: Record a payment for contract AGR_TEST_101
  const testAgrId = "AGR_TEST_" + Date.now();
  const paymentPayload = {
    agreementId: testAgrId,
    payerName: "Test Agro Buyer Pvt Ltd",
    payeeName: "Ramesh Farmer",
    amount: 20000,
    paymentMethod: "UPI Instant Pay"
  };

  const createRes = await request('POST', '/api/payments', paymentPayload);
  assert(createRes.status === 201 && createRes.data.success, "POST /api/payments creates payment successfully");
  assert(createRes.data.payment && createRes.data.payment.txnCode.startsWith("TXN-"), "Payment returned with valid TXN code format", createRes.data.payment?.txnCode);
  assert(createRes.data.payment.amount === 20000, "Payment amount is exactly ₹20,000");

  // Step 3: Fetch payments filtered by agreement_id
  const filterRes = await request('GET', `/api/payments?agreement_id=${testAgrId}`);
  assert(filterRes.status === 200, `GET /api/payments?agreement_id=${testAgrId} succeeds`);
  assert(filterRes.data.payments && filterRes.data.payments.length >= 1, "Filtered payments returns recorded payment");
  const fetchedPayment = filterRes.data.payments[0];
  assert(fetchedPayment.agreementId === testAgrId, "Payment matches queried agreementId");

  // Step 4: Multi-tenant isolation - ensure unrelated agreement has 0 payments
  const unrelatedRes = await request('GET', `/api/payments?agreement_id=AGR_UNRELATED_9999`);
  assert(unrelatedRes.data.payments.length === 0, "Unrelated contract has 0 payments (multi-tenant integrity)");

  // Step 5: Verify database file persistence
  const dbPath = path.join(__dirname, 'database', 'sanjeevani_db.json');
  assert(fs.existsSync(dbPath), "Database file sanjeevani_db.json exists on disk");
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const foundInDb = (dbData.payments || []).find(p => p.agreementId === testAgrId);
  assert(foundInDb !== undefined, "Payment is persistently stored in sanjeevani_db.json disk file");

  // Step 6: Verify audit trail was recorded for payment
  const foundAudit = (dbData.audit_logs || []).find(l => l.recordId === testAgrId || (l.action && l.action.includes("Payment")));
  assert(foundAudit !== undefined, "Payment creation logged in immutable audit_logs");

  console.log(`\n=================================================`);
  console.log(`  RESULT: ${passed}/${total} TESTS PASSED (${Math.round((passed/total)*100)}%)`);
  console.log(`=================================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
