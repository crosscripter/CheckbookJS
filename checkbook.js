function Entry(date, memo, amount, cleared, number) {
  this.date = date || new Date();
  this.memo = memo || '';
  this.amount = amount || 0;
  this.cleared = cleared || false;
  this.number = number || 0;
}

function CheckBook(balance, entries) {
  this.starting_balance = balance || 0;
  this.balance = this.starting_balance;
  this.entries = entries || [];

  this.add_new_entry = function(entry) { this.entries.push(entry); };

  this.import_entries = function(entries) {
    for (var entry in entries) { this.add_new_entry(entries[entry]); }
  };

  this.get_balance = function(entries) {
    return entries.map(function(entry) { return entry.amount; })
                  .reduce(function(a, b) { return a + b; }) + this.balance;
  }

  this.current_balance = function() { return this.get_balance(this.entries); };

  this.available_balance = function() {
    var cleared_entries = this.entries.filter(function(entry) { return entry.cleared; });
    return (cleared_entries.length === 0) ? this.current_balance() : this.get_balance(cleared_entries);
  };

  this.get_entry_by_check_number = function(check_number) {
    return this.entries.filter(function(entry) { return entry.number === check_number; });
  };
}

var assert = require('assert');

var date = new Date('03/10/2014');
var e = new Entry(date, 'Walmart', -5.00);
assert(e.date === date, 'date');
assert(e.memo === 'Walmart', 'memo');
assert(e.amount === -5, 'amount');
assert(e.cleared === false, 'cleared');
assert(e.number === 0, 'number');

var cb = new CheckBook(10.00);
assert(cb.starting_balance === 10.00, 'starting balance');
assert(cb.balance === cb.starting_balance, 'balance');
assert(cb.entries.length === 0, 'entries');
cb.add_new_entry(e);
assert(cb.get_balance(cb.entries) === cb.balance + e.amount, 'get_bal');
assert(cb.current_balance() === cb.balance + e.amount, 'cur_bal');
assert(cb.available_balance() === cb.current_balance(), 'avail_bal');

cb = new CheckBook(100.00, [
  new Entry(new Date('3/1/15'), 'Store A', -1.00),
  new Entry(new Date('3/2/15'), 'Store B', -2.00),
  new Entry(new Date('3/3/15'), 'Store C', -3.00),
  new Entry(new Date('3/4/15'), 'Check 1', -10.00, true, 1)
]);

assert(cb.starting_balance === 100.00, 'start bal = 100');
assert(cb.balance === cb.starting_balance, 'bal = start bal');
assert(cb.entries.length === 4, '4 entries');
assert(cb.entries[0].amount === -1.00, 'entry 1 $1');
assert(cb.entries[2].memo === 'Store C', 'entry 3 memo = Store C');
assert(cb.current_balance() === (100.00 + -1.00 + -2.00 + -3.00 + -10.00), 'cur bal = entries amt + bal');
assert(cb.available_balance() === cb.current_balance(), 'avail bal = cur bal');
