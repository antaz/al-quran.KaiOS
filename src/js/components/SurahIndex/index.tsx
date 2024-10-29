import { formatNumber, TFunction } from "~/lib/t";
import { Arrow } from "~/components/Icon";
import { Head } from "~/components/Head";
import { getNextRef } from "~/lib/utils";
import "@css/main/SurahIndex.scss";

type Props = {
  localeId: string;
  t: TFunction;
};

export function SurahIndex({ localeId, t }: Props) {
  const { theme, locale, setLocale } = useContext(SettingsContext);
  const index = useMemo(() => Quran.surahs[locale.name], [locale.name]);
  const ulRef = useRef<HTMLUListElement>(null);
  const refs = useMemo(
    () => Quran.surahs[locale.name].map(() => createRef()),
    Quran.surahs.length,
  );

  function getNextScrollTop(e: KeyboardEvent) {
    const ul = ulRef.current;
    if (!ul) {
      return 0;
    } else if (e.key === "ArrowDown") {
      return ul.scrollTop - 35;
    } else if (e.key === "ArrowUp") {
      return ul.scrollTop + 35;
    } else {
      return ul.scrollTop;
    }
  }

  function onKeyPress(e: KeyboardEvent) {
    const ul = ulRef.current;
    if (!ul) {
      return;
    } else {
      const anchor = getNextRef(e, refs)?.current;
      if (anchor) {
        anchor.focus();
        ul.scroll({ behavior: "auto" });
        ul.scrollTop = getNextScrollTop(e);
      }
    }
  }

  useEffect(() => {
    setLocale(Quran.locales[localeId]);
  }, [localeId]);

  useEffect(() => {
    const ref = refs[0];
    const anchor = ref.current;
    if (anchor) {
      anchor.focus();
    }
  }, [locale.name]);

  useEffect(() => {
    refs.forEach((ref: React.RefObject<HTMLAnchorElement>) => {
      if (ref.current) {
        const el = ref.current;
        el.addEventListener("keydown", onKeyPress);
      }
    });
  }, [refs]);

  return (
    <div
      className={classNames(
        "flex flex-col h-full content surah-index theme",
        theme,
        locale.name,
        locale.direction,
      )}
    >
      <Head>{t(locale, "TheNobleQuran")}</Head>
      <ul
        ref={ulRef}
        className="flex flex-wrap body index scroll-y list-none m-0 p-0 w-full h-full"
      >
        {index.map((surah, key) => (
          <li
            className={classNames("flex justify-center surah mb-2", {
              "w-full": locale.direction === "ltr",
              "w-1/2": locale.direction === "rtl",
            })}
            key={key}
          >
            <a
              data-index={key}
              data-context="index-list-item"
              ref={refs[key]}
              className="flex items-center color-primary no-underline rounded w-11/12 h-8"
              href={`/${locale.name}/${surah.id}/`}
            >
              <span className="flex items-center justify-center h-6 background-primary color-secondary ml-2 mr-3 rounded font-extrabold w-14 text-center">
                {formatNumber(locale, surah.id)}
              </span>
              <span className="w-48">{surah.name}</span>
            </a>
          </li>
        ))}
      </ul>
      <footer className="flex flex-row justify-between mb-5 h-12">
        <a
          className="flex flex-row items-center no-underline"
          href={`/${locale.name}/random/`}
        >
          {locale.direction === "ltr" ? (
            <Arrow direction="right" />
          ) : (
            <Arrow direction="left" />
          )}
          <span
            className={classNames({
              "pl-3": locale.direction === "ltr",
              "pr-3": locale.direction === "rtl",
            })}
          >
            {t(locale, "ChooseRandomChapter")}
          </span>
        </a>
      </footer>
    </div>
  );
}
