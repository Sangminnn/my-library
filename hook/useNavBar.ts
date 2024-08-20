import { useCallback, useEffect, useRef, useState } from "react";

import useDevice from "@hooks/useDevice";
import useScrollTo from "@hooks/useScrollTo";
import { DeviceType } from "@models/enums/device.enum";

type TabContentsElement<T extends string> = Record<T, HTMLElement | null>;

interface UseNavBarProps<T extends string> {
  offsetTop: number;
  elements: TabContentsElement<T>;
}

type BreakPoints<T extends string> = Record<T, { top: number; bottom: number }>;

const useNavBar = <TabKey extends string>({
  offsetTop,
  elements,
}: UseNavBarProps<TabKey>) => {
  const [selectedTab, setSelectedTab] = useState<TabKey>(
    Object.keys(elements)[0] as TabKey
  );
  const breakpoints = useRef<BreakPoints<TabKey>>({} as BreakPoints<TabKey>);

  const { scrollToPosition } = useScrollTo();

  const prevScrollY = useRef(0);
  const isScrolling = useRef(false);
  const clickedTab = useRef<TabKey | null>(null);

  const { os, browser } = useDevice();
  const isIOS = DeviceType.IOS === os;
  const isSafari = browser === "Mobile Safari" || browser === "Safari";

  const handleScrollEnd = () => {
    isScrolling.current = false;
    if (clickedTab.current) {
      setSelectedTab(clickedTab.current);
      clickedTab.current = null;
    }
  };

  const onTabClick = useCallback(
    (key: TabKey) => {
      const itemOffsetTop = elements[key]?.offsetTop || 0;

      clickedTab.current = key;
      isScrolling.current = true;

      /** ios 및 safari에서는 scrollEnd 이벤트를 지원하지 않기때문에 setTimeout으로 polyfill 적용 */
      if (isIOS || isSafari) {
        setTimeout(() => {
          handleScrollEnd();
        }, 300);
      }

      scrollToPosition({ top: itemOffsetTop - offsetTop, behavior: "smooth" });
    },
    [scrollToPosition, offsetTop, elements]
  );

  const updateBreakpoints = useCallback(() => {
    Object.entries(elements as { [key: string]: HTMLElement }).forEach(
      ([key, element]) => {
        if (element) {
          breakpoints.current[key as TabKey] = {
            top: element.offsetTop - offsetTop,
            bottom: element.offsetTop + element.offsetHeight - offsetTop,
          };
        }
      }
    );
  }, [elements, offsetTop]);

  useEffect(() => {
    updateBreakpoints();

    window.addEventListener("resize", updateBreakpoints);
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, [updateBreakpoints]);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current || clickedTab.current) return;

      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > prevScrollY.current;
      const viewportTop = currentScrollY + offsetTop;

      let newSelectedTab: TabKey | null = null;

      Object.entries(breakpoints.current).forEach(([key, value]) => {
        const { top, bottom } = value as { top: number; bottom: number };

        if (isScrollingDown && viewportTop >= top && viewportTop < bottom) {
          newSelectedTab = key as TabKey;
        } else if (
          !isScrollingDown &&
          viewportTop > top &&
          viewportTop <= bottom
        ) {
          newSelectedTab = key as TabKey;
        }
      });

      if (newSelectedTab) {
        setSelectedTab(newSelectedTab);
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scrollend", handleScrollEnd);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [offsetTop]);

  const contentsAreaRefCallback = useCallback(
    (node: HTMLElement | null, key: TabKey) => {
      if (node) {
        elements[key] = node;
        updateBreakpoints();
      }
    },
    [elements, updateBreakpoints]
  );

  return {
    selectedTab,
    onTabClick,
    contentsAreaRefCallback,
  };
};

export default useNavBar;
