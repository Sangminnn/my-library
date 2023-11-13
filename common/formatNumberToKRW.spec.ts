import formatNumberToKRW, {
  ceilNumber,
  floorNumber,
  FormatNumberToKRWProps,
  roundNumber,
} from "./formatNumberToKRW";

describe("ceil, floor, round", () => {
  test("ceilNumber", () => {
    expect(ceilNumber(123456, 100)).toBe(124000);
    expect(ceilNumber(1987283, 100000)).toBe(2000000);
    expect(ceilNumber(320, 10)).toBe(400);
  });

  test("floorNumber", () => {
    expect(floorNumber(1992350, 10000)).toBe(1900000);
    expect(floorNumber(885020, 100)).toBe(885000);
    expect(floorNumber(3201, 10)).toBe(3200);
  });

  test("roundNumber", () => {
    expect(roundNumber(9934019, 1000)).toBe(9930000);
    expect(roundNumber(1782, 1)).toBe(1780);
    expect(roundNumber(68293840, 1000000)).toBe(70000000);
  });
});

describe("emptyFormat에 따라 0원일때 표기법을 다르게한다.", () => {
  const defaultOption = {
    value: 0,
    dividePriceLine: 100000,
  };

  it("emptyFormat이 dash라면 0원일때 -원으로 표기된다.", () => {
    const formattedValue = formatNumberToKRW({
      ...defaultOption,
      emptyFormat: "dash",
    });
    expect(formattedValue).toBe("-원");
  });
  it("emptyFormat이 zero라면 0원일때 0원으로 표기된다.", () => {
    const formattedValue = formatNumberToKRW({
      ...defaultOption,
      emptyFormat: "zero",
    });

    expect(formattedValue).toBe("0원");
  });
});

describe("dividePriceLine을 기준으로 -만원과 -원을 나눈다.", () => {
  // 1000원단위 절삭을 기준으로합니다.
  const defaultOptions: FormatNumberToKRWProps["options"] = {
    action: "floor",
    actionTargetLine: 1000,
  };

  test("dividePriceLine보다 value가 크면 -만원으로 표기한다.", () => {
    expect(
      formatNumberToKRW({
        value: 1983847,
        dividePriceLine: 100000,
        options: defaultOptions,
      })
    ).toBe("198만원");
    expect(
      formatNumberToKRW({
        value: 19838000,
        dividePriceLine: 10000000,
        options: defaultOptions,
      })
    ).toBe("1,983만원");
  });

  test("dividePriceLine보다 value가 작으면 -원으로 표기한다.", () => {
    expect(
      formatNumberToKRW({
        value: 129620,
        dividePriceLine: 1000000,
        options: defaultOptions,
      })
    ).toBe("120,000원");

    expect(
      formatNumberToKRW({
        value: 5429620,
        dividePriceLine: 10000000,
        options: defaultOptions,
      })
    ).toBe("5,420,000원");
  });
});
