import { useState, useCallback } from "react";

// ===== DATA =====
const SETUIRI_DATA={1874:[1874,5,4,6,5,6,6,7,8,8,8,7,7],1875:[1875,6,4,6,5,6,6,7,8,8,9,8,7],1876:[1876,6,4,5,4,5,5,7,7,7,8,7,7],1877:[1877,5,4,5,5,5,6,7,7,7,8,7,7],1878:[1878,5,4,6,5,6,6,7,8,8,8,7,7],1879:[1879,6,4,6,5,6,6,7,8,8,9,8,7],1880:[1880,6,4,5,4,5,5,7,7,7,8,7,7],1881:[1881,5,4,5,5,5,5,7,7,7,8,7,7],1882:[1882,5,4,6,5,6,6,7,8,8,8,7,7],1883:[1883,6,4,6,5,6,6,7,8,8,9,8,7],1884:[1884,6,4,5,4,5,5,7,7,7,8,7,7],1885:[1885,5,3,5,4,5,5,7,7,7,8,7,7],1886:[1886,5,4,6,5,5,6,7,8,8,8,7,7],1887:[1887,5,4,6,5,6,6,7,8,8,8,8,7],1888:[1888,6,4,5,4,5,5,7,7,7,8,7,7],1889:[1889,5,3,5,4,5,5,7,7,7,8,7,7],1890:[1890,5,4,5,5,5,6,7,8,8,8,7,7],1891:[1891,5,4,6,5,6,6,7,8,8,8,8,7],1892:[1892,6,4,5,4,5,5,7,7,7,8,7,6],1893:[1893,5,3,5,4,5,5,7,7,7,8,7,7],1894:[1894,5,4,5,5,5,6,7,7,8,8,7,7],1895:[1895,5,4,6,5,6,6,7,8,8,8,8,7],1896:[1896,6,4,5,4,5,5,7,7,7,8,7,6],1897:[1897,5,3,5,4,5,5,7,7,7,8,7,7],1898:[1898,5,4,5,5,5,6,7,7,8,8,7,7],1899:[1899,5,4,6,5,6,6,7,8,8,8,7,7],1900:[1900,6,4,6,5,6,6,8,8,8,9,8,7],1901:[1901,6,4,6,5,6,6,8,8,8,9,8,8],1902:[1902,6,5,6,6,6,7,8,8,8,9,8,8],1903:[1903,6,5,7,6,7,7,8,9,9,9,8,8],1904:[1904,7,5,6,5,6,6,7,8,8,9,8,7],1905:[1905,6,4,6,5,6,6,8,8,8,9,8,8],1906:[1906,6,5,6,6,6,7,8,8,8,9,8,8],1907:[1907,6,5,7,6,7,7,8,9,9,9,8,8],1908:[1908,7,5,6,5,6,6,7,8,8,9,8,7],1909:[1909,6,4,6,5,6,6,8,8,8,9,8,8],1910:[1910,6,5,6,6,6,6,8,8,8,9,8,8],1911:[1911,6,5,7,6,7,7,8,9,9,9,8,8],1912:[1912,7,5,6,5,6,6,7,8,8,9,8,7],1913:[1913,6,4,6,5,6,6,8,8,8,9,8,8],1914:[1914,6,5,6,6,6,6,8,8,8,9,8,8],1915:[1915,6,5,7,6,7,7,8,9,9,9,8,8],1916:[1916,7,5,6,5,6,6,7,8,8,9,8,7],1917:[1917,6,4,6,5,6,6,8,8,8,9,8,8],1918:[1918,6,4,6,5,6,6,8,8,8,9,8,8],1919:[1919,6,5,7,6,6,7,8,8,9,9,8,8],1920:[1920,6,5,6,5,6,6,7,8,8,8,8,7],1921:[1921,6,4,6,5,6,6,8,8,8,9,8,8],1922:[1922,6,4,6,5,6,6,8,8,8,9,8,8],1923:[1923,6,5,6,6,6,7,8,8,9,9,8,8],1924:[1924,6,5,6,5,6,6,7,8,8,8,8,7],1925:[1925,6,4,6,5,6,6,8,8,8,9,8,7],1926:[1926,6,4,6,5,6,6,8,8,8,9,8,8],1927:[1927,6,5,6,6,6,7,8,8,9,9,8,8],1928:[1928,6,5,6,5,6,6,7,8,8,8,8,7],1929:[1929,6,4,6,5,6,6,8,8,8,9,8,7],1930:[1930,6,4,6,5,6,6,8,8,8,9,8,8],1931:[1931,6,5,6,6,6,7,8,8,9,9,8,8],1932:[1932,6,5,6,5,6,6,7,8,8,8,7,7],1933:[1933,6,4,6,5,6,6,7,8,8,9,8,7],1934:[1934,6,4,6,5,6,6,8,8,8,9,8,8],1935:[1935,6,5,6,6,6,7,8,8,8,9,8,8],1936:[1936,6,5,6,5,6,6,7,8,8,8,7,7],1937:[1937,6,4,6,5,6,6,7,8,8,9,8,7],1938:[1938,6,4,6,5,6,6,8,8,8,9,8,8],1939:[1939,6,5,6,6,6,6,8,8,8,9,8,8],1940:[1940,6,5,6,5,6,6,7,8,8,8,7,7],1941:[1941,6,4,6,5,6,6,7,8,8,9,8,7],1942:[1942,6,4,6,5,6,6,8,8,8,9,8,8],1943:[1943,6,5,6,6,6,6,8,8,8,9,8,8],1944:[1944,6,5,6,5,6,6,7,8,8,8,7,7],1945:[1945,6,4,6,5,6,6,7,8,8,9,8,7],1946:[1946,6,4,6,5,6,6,8,8,8,9,8,8],1947:[1947,6,5,6,6,6,6,8,8,8,9,8,8],1948:[1948,6,5,6,5,6,6,7,8,8,8,7,7],1949:[1949,6,4,6,5,6,6,7,8,8,9,8,7],1950:[1950,6,4,6,5,6,6,8,8,8,9,8,8],1951:[1951,6,5,6,5,6,6,8,8,8,9,8,8],1952:[1952,6,5,6,5,5,6,7,7,8,8,7,7],1953:[1953,6,4,6,5,6,6,7,8,8,8,8,7],1954:[1954,6,4,6,5,6,6,8,8,8,9,8,8],1955:[1955,6,4,6,5,6,6,8,8,8,9,8,8],1956:[1956,6,5,5,5,5,6,7,7,8,8,7,7],1957:[1957,5,4,6,5,6,6,7,8,8,8,8,7],1958:[1958,6,4,6,5,6,6,8,8,8,9,8,7],1959:[1959,6,4,6,5,6,6,8,8,8,9,8,8],1960:[1960,6,5,5,5,5,6,7,7,8,8,7,7],1961:[1961,5,4,6,5,6,6,7,8,8,8,8,7],1962:[1962,6,4,6,5,6,6,7,8,8,9,8,7],1963:[1963,6,4,6,5,6,6,8,8,8,9,8,8],1964:[1964,6,5,5,5,5,6,7,7,7,8,7,7],1965:[1965,5,4,6,5,6,6,7,8,8,8,8,7],1966:[1966,6,4,6,5,6,6,7,8,8,9,8,7],1967:[1967,6,4,6,5,6,6,8,8,8,9,8,8],1968:[1968,6,5,5,5,5,6,7,7,7,8,7,7],1969:[1969,5,4,6,5,6,6,7,8,8,8,7,7],1970:[1970,6,4,6,5,6,6,7,8,8,9,8,7],1971:[1971,6,4,6,5,6,6,8,8,8,9,8,8],1972:[1972,6,5,5,5,5,5,7,7,7,8,7,7],1973:[1973,5,4,6,5,6,6,7,8,8,8,7,7],1974:[1974,6,4,6,5,6,6,7,8,8,9,8,7],1975:[1975,6,4,6,5,6,6,8,8,8,9,8,8],1976:[1976,6,5,5,5,5,5,7,7,7,8,7,7],1977:[1977,5,4,6,5,6,6,7,8,8,8,7,7],1978:[1978,6,4,6,5,6,6,7,8,8,9,8,7],1979:[1979,6,4,6,5,6,6,8,8,8,9,8,8],1980:[1980,6,5,5,5,5,5,7,7,7,8,7,7],1981:[1981,5,4,6,5,5,6,7,7,8,8,7,7],1982:[1982,6,4,6,5,6,6,7,8,8,9,8,7],1983:[1983,6,4,6,5,6,6,8,8,8,9,8,8],1984:[1984,6,5,5,4,5,5,7,7,7,8,7,7],1985:[1985,5,4,6,5,5,6,7,7,8,8,7,7],1986:[1986,6,4,6,5,6,6,7,8,8,8,8,7],1987:[1987,6,4,6,5,6,6,8,8,8,9,8,8],1988:[1988,6,4,5,4,5,5,7,7,7,8,7,7],1989:[1989,5,4,5,5,5,6,7,7,8,8,7,7],1990:[1990,5,4,6,5,6,6,7,8,8,8,8,7],1991:[1991,6,4,6,5,6,6,7,8,8,9,8,7],1992:[1992,6,4,5,4,5,5,7,7,7,8,7,7],1993:[1993,5,4,5,5,5,6,7,7,8,8,7,7],1994:[1994,5,4,6,5,6,6,7,8,8,8,8,7],1995:[1995,6,4,6,5,6,6,7,8,8,9,8,7],1996:[1996,6,4,5,4,5,5,7,7,7,8,7,7],1997:[1997,5,4,5,5,5,6,7,7,7,8,7,7],1998:[1998,5,4,6,5,6,6,7,8,8,8,8,7],1999:[1999,6,4,6,5,6,6,7,8,8,9,8,7],2000:[2000,6,4,5,4,5,5,7,7,7,8,7,7],2001:[2001,5,4,5,5,5,5,7,7,7,8,7,7],2002:[2002,5,4,6,5,6,6,7,8,8,8,7,7],2003:[2003,6,4,6,5,6,6,7,8,8,9,8,7],2004:[2004,6,4,5,4,5,5,7,7,7,8,7,7],2005:[2005,5,4,5,5,5,5,7,7,7,8,7,7],2006:[2006,5,4,6,5,6,6,7,8,8,8,7,7],2007:[2007,6,4,6,5,6,6,7,8,8,9,8,7],2008:[2008,6,4,5,4,5,5,7,7,7,8,7,7],2009:[2009,5,4,5,5,5,5,7,7,7,8,7,7],2010:[2010,5,4,6,5,5,6,7,7,8,8,7,7],2011:[2011,6,4,6,5,6,6,7,8,8,9,8,7],2012:[2012,6,4,5,4,5,5,7,7,7,8,7,7],2013:[2013,5,4,5,5,5,5,7,7,7,8,7,7],2014:[2014,5,4,6,5,5,6,7,7,8,8,7,7],2015:[2015,6,4,6,5,6,6,7,8,8,8,8,7],2016:[2016,6,4,5,4,5,5,7,7,7,8,7,7],2017:[2017,5,4,5,4,5,5,7,7,7,8,7,7],2018:[2018,5,4,6,5,5,6,7,7,8,8,7,7],2019:[2019,6,4,6,5,6,6,7,8,8,8,8,7],2020:[2020,6,4,5,4,5,5,7,7,7,8,7,7],2021:[2021,5,3,5,4,5,5,7,7,7,8,7,7],2022:[2022,5,4,5,5,5,6,7,7,8,8,7,7],2023:[2023,6,4,6,5,6,6,7,8,8,8,8,7],2024:[2024,6,4,5,4,5,5,6,7,7,8,7,7],2025:[2025,5,3,5,4,5,5,7,7,7,8,7,7],2026:[2026,5,4,5,5,5,6,7,7,7,8,7,7],2027:[2027,5,4,6,5,6,6,7,8,8,8,8,7],2028:[2028,6,4,5,4,5,5,6,7,7,8,7,6],2029:[2029,5,3,5,4,5,5,7,7,7,8,7,7],2030:[2030,5,4,5,5,5,5,7,7,7,8,7,7],2031:[2031,5,4,6,5,6,6,7,8,8,8,8,7],2032:[2032,6,4,5,4,5,5,6,7,7,8,7,6],2033:[2033,5,3,5,4,5,5,7,7,7,8,7,7],2034:[2034,5,4,5,5,5,5,7,7,7,8,7,7],2035:[2035,5,4,6,5,6,6,7,8,8,8,7,7],2036:[2036,6,4,5,4,5,5,6,7,7,8,7,6],2037:[2037,5,3,5,4,5,5,7,7,7,8,7,7],2038:[2038,5,4,5,5,5,5,7,7,7,8,7,7],2039:[2039,5,4,6,5,6,6,7,8,8,8,7,7],2040:[2040,6,4,5,4,5,5,6,7,7,8,7,6],2041:[2041,5,3,5,4,5,5,7,7,7,8,7,7],2042:[2042,5,4,5,5,5,5,7,7,7,8,7,7],2043:[2043,5,4,6,5,5,6,7,7,8,8,8,7],2044:[2044,6,4,5,4,5,5,6,7,7,8,7,6],2045:[2045,5,3,5,4,5,5,7,7,7,8,7,7],2046:[2046,5,4,5,4,5,5,7,7,7,8,7,7],2047:[2047,5,4,6,5,5,6,7,8,8,7,7],2048:[2048,6,4,5,4,5,5,6,7,7,7,7,6],2049:[2049,5,3,5,4,5,5,7,7,7,8,7,7],2050:[2050,5,4,5,4,5,5,7,7,7,8,7,7]};
const KANSHI_TABLE=[null,{kan:"甲",shi:"子",tenshuu:"戌亥"},{kan:"乙",shi:"丑",tenshuu:"戌亥"},{kan:"丙",shi:"寅",tenshuu:"戌亥"},{kan:"丁",shi:"卯",tenshuu:"戌亥"},{kan:"戊",shi:"辰",tenshuu:"戌亥"},{kan:"己",shi:"巳",tenshuu:"戌亥"},{kan:"庚",shi:"午",tenshuu:"戌亥"},{kan:"辛",shi:"未",tenshuu:"戌亥"},{kan:"壬",shi:"申",tenshuu:"戌亥"},{kan:"癸",shi:"酉",tenshuu:"戌亥"},{kan:"甲",shi:"戌",tenshuu:"申酉"},{kan:"乙",shi:"亥",tenshuu:"申酉"},{kan:"丙",shi:"子",tenshuu:"申酉"},{kan:"丁",shi:"丑",tenshuu:"申酉"},{kan:"戊",shi:"寅",tenshuu:"申酉"},{kan:"己",shi:"卯",tenshuu:"申酉"},{kan:"庚",shi:"辰",tenshuu:"申酉"},{kan:"辛",shi:"巳",tenshuu:"申酉"},{kan:"壬",shi:"午",tenshuu:"申酉"},{kan:"癸",shi:"未",tenshuu:"申酉"},{kan:"甲",shi:"申",tenshuu:"午未"},{kan:"乙",shi:"酉",tenshuu:"午未"},{kan:"丙",shi:"戌",tenshuu:"午未"},{kan:"丁",shi:"亥",tenshuu:"午未"},{kan:"戊",shi:"子",tenshuu:"午未"},{kan:"己",shi:"丑",tenshuu:"午未"},{kan:"庚",shi:"寅",tenshuu:"午未"},{kan:"辛",shi:"卯",tenshuu:"午未"},{kan:"壬",shi:"辰",tenshuu:"午未"},{kan:"癸",shi:"巳",tenshuu:"午未"},{kan:"甲",shi:"午",tenshuu:"辰巳"},{kan:"乙",shi:"未",tenshuu:"辰巳"},{kan:"丙",shi:"申",tenshuu:"辰巳"},{kan:"丁",shi:"酉",tenshuu:"辰巳"},{kan:"戊",shi:"戌",tenshuu:"辰巳"},{kan:"己",shi:"亥",tenshuu:"辰巳"},{kan:"庚",shi:"子",tenshuu:"辰巳"},{kan:"辛",shi:"丑",tenshuu:"辰巳"},{kan:"壬",shi:"寅",tenshuu:"辰巳"},{kan:"癸",shi:"卯",tenshuu:"辰巳"},{kan:"甲",shi:"辰",tenshuu:"寅卯"},{kan:"乙",shi:"巳",tenshuu:"寅卯"},{kan:"丙",shi:"午",tenshuu:"寅卯"},{kan:"丁",shi:"未",tenshuu:"寅卯"},{kan:"戊",shi:"申",tenshuu:"寅卯"},{kan:"己",shi:"酉",tenshuu:"寅卯"},{kan:"庚",shi:"戌",tenshuu:"寅卯"},{kan:"辛",shi:"亥",tenshuu:"寅卯"},{kan:"壬",shi:"子",tenshuu:"寅卯"},{kan:"癸",shi:"丑",tenshuu:"寅卯"},{kan:"甲",shi:"寅",tenshuu:"子丑"},{kan:"乙",shi:"卯",tenshuu:"子丑"},{kan:"丙",shi:"辰",tenshuu:"子丑"},{kan:"丁",shi:"巳",tenshuu:"子丑"},{kan:"戊",shi:"午",tenshuu:"子丑"},{kan:"己",shi:"未",tenshuu:"子丑"},{kan:"庚",shi:"申",tenshuu:"子丑"},{kan:"辛",shi:"酉",tenshuu:"子丑"},{kan:"壬",shi:"戌",tenshuu:"子丑"},{kan:"癸",shi:"亥",tenshuu:"子丑"}];
const SYUSEI_MAP={"甲":{"甲":"貫索星","乙":"石門星","丙":"鳳閣星","丁":"調舒星","戊":"禄存星","己":"司禄星","庚":"車騎星","辛":"牽牛星","壬":"龍高星","癸":"玉堂星"},"乙":{"甲":"石門星","乙":"貫索星","丙":"調舒星","丁":"鳳閣星","戊":"司禄星","己":"禄存星","庚":"牽牛星","辛":"車騎星","壬":"玉堂星","癸":"龍高星"},"丙":{"甲":"龍高星","乙":"玉堂星","丙":"貫索星","丁":"石門星","戊":"鳳閣星","己":"調舒星","庚":"禄存星","辛":"司禄星","壬":"車騎星","癸":"牽牛星"},"丁":{"甲":"玉堂星","乙":"龍高星","丙":"石門星","丁":"貫索星","戊":"調舒星","己":"鳳閣星","庚":"司禄星","辛":"禄存星","壬":"牽牛星","癸":"車騎星"},"戊":{"甲":"車騎星","乙":"牽牛星","丙":"龍高星","丁":"玉堂星","戊":"貫索星","己":"石門星","庚":"鳳閣星","辛":"調舒星","壬":"禄存星","癸":"司禄星"},"己":{"甲":"牽牛星","乙":"車騎星","丙":"玉堂星","丁":"龍高星","戊":"石門星","己":"貫索星","庚":"調舒星","辛":"鳳閣星","壬":"司禄星","癸":"禄存星"},"庚":{"甲":"禄存星","乙":"司禄星","丙":"車騎星","丁":"牽牛星","戊":"龍高星","己":"玉堂星","庚":"貫索星","辛":"石門星","壬":"鳳閣星","癸":"調舒星"},"辛":{"甲":"司禄星","乙":"禄存星","丙":"牽牛星","丁":"車騎星","戊":"玉堂星","己":"龍高星","庚":"石門星","辛":"貫索星","壬":"調舒星","癸":"鳳閣星"},"壬":{"甲":"鳳閣星","乙":"調舒星","丙":"禄存星","丁":"司禄星","戊":"車騎星","己":"牽牛星","庚":"龍高星","辛":"玉堂星","壬":"貫索星","癸":"石門星"},"癸":{"甲":"調舒星","乙":"鳳閣星","丙":"司禄星","丁":"禄存星","戊":"牽牛星","己":"車騎星","庚":"玉堂星","辛":"龍高星","壬":"石門星","癸":"貫索星"}};
const ZYUUSEI_MAP={"甲":{"子":"天恍星","丑":"天南星","寅":"天禄星","卯":"天将星","辰":"天堂星","巳":"天胡星","午":"天極星","未":"天庫星","申":"天馳星","酉":"天報星","戌":"天印星","亥":"天貴星"},"乙":{"子":"天胡星","丑":"天堂星","寅":"天将星","卯":"天禄星","辰":"天南星","巳":"天恍星","午":"天貴星","未":"天印星","申":"天報星","酉":"天馳星","戌":"天庫星","亥":"天極星"},"丙":{"子":"天報星","丑":"天印星","寅":"天貴星","卯":"天恍星","辰":"天南星","巳":"天禄星","午":"天将星","未":"天堂星","申":"天胡星","酉":"天極星","戌":"天庫星","亥":"天馳星"},"丁":{"子":"天馳星","丑":"天庫星","寅":"天極星","卯":"天胡星","辰":"天堂星","巳":"天将星","午":"天禄星","未":"天南星","申":"天恍星","酉":"天貴星","戌":"天印星","亥":"天報星"},"戊":{"子":"天報星","丑":"天印星","寅":"天貴星","卯":"天恍星","辰":"天南星","巳":"天禄星","午":"天将星","未":"天堂星","申":"天胡星","酉":"天極星","戌":"天庫星","亥":"天馳星"},"己":{"子":"天馳星","丑":"天庫星","寅":"天極星","卯":"天胡星","辰":"天堂星","巳":"天将星","午":"天禄星","未":"天南星","申":"天恍星","酉":"天貴星","戌":"天印星","亥":"天報星"},"庚":{"子":"天極星","丑":"天庫星","寅":"天馳星","卯":"天報星","辰":"天印星","巳":"天貴星","午":"天恍星","未":"天南星","申":"天禄星","酉":"天将星","戌":"天堂星","亥":"天胡星"},"辛":{"子":"天貴星","丑":"天印星","寅":"天報星","卯":"天馳星","辰":"天庫星","巳":"天極星","午":"天胡星","未":"天堂星","申":"天将星","酉":"天禄星","戌":"天南星","亥":"天恍星"},"壬":{"子":"天将星","丑":"天堂星","寅":"天胡星","卯":"天極星","辰":"天庫星","巳":"天馳星","午":"天報星","未":"天印星","申":"天貴星","酉":"天恍星","戌":"天南星","亥":"天禄星"},"癸":{"子":"天禄星","丑":"天南星","寅":"天恍星","卯":"天貴星","辰":"天印星","巳":"天報星","午":"天馳星","未":"天庫星","申":"天極星","酉":"天胡星","戌":"天堂星","亥":"天将星"}};
const SUURI_POINTS_TABLE={"子":[7,4,3,1,3,1,2,9,12,11],"丑":[10,8,6,5,6,5,5,6,8,10],"寅":[11,12,9,2,9,2,1,3,4,7],"卯":[12,11,7,4,7,4,3,1,2,9],"辰":[8,10,10,8,10,8,6,5,5,6],"巳":[4,7,11,12,11,12,9,2,1,3],"午":[2,9,12,11,12,11,7,4,3,1],"未":[5,6,8,10,8,10,10,8,6,5],"申":[1,3,4,7,4,7,11,12,9,2],"酉":[3,1,2,9,2,9,12,11,7,4],"戌":[6,5,5,6,5,6,8,10,10,8],"亥":[9,2,1,3,1,3,4,7,11,12]};
const KAN_INDEX={"甲":0,"乙":1,"丙":2,"丁":3,"戊":4,"己":5,"庚":6,"辛":7,"壬":8,"癸":9};

// ===== LOGIC =====
function getZoukanAll(e){switch(e){case"子":return["","","癸"];case"丑":return["癸","辛","己"];case"寅":return["戊","丙","甲"];case"卯":return["","","乙"];case"辰":return["乙","癸","戊"];case"巳":return["戊","庚","丙"];case"午":return["","己","丁"];case"未":return["丁","乙","己"];case"申":return["戊","壬","庚"];case"酉":return["","","辛"];case"戌":return["辛","丁","戊"];case"亥":return["","甲","壬"];default:return["","",""]}}
function getZoukan(e,d){switch(e){case"子":return"癸";case"丑":return d>=0&&d<=9?"癸":d>9&&d<=12?"辛":"己";case"寅":return d>=0&&d<=7?"戊":d>7&&d<=14?"丙":"甲";case"卯":return"乙";case"辰":return d>=0&&d<=9?"乙":d>9&&d<=12?"癸":"戊";case"巳":return d>=0&&d<=5?"戊":d>5&&d<=14?"庚":"丙";case"午":return d>=0&&d<=19?"己":"丁";case"未":return d>=0&&d<=9?"丁":d>9&&d<=12?"乙":"己";case"申":return d>=0&&d<=10?"戊":d>10&&d<=13?"壬":"庚";case"酉":return"辛";case"戌":return d>=0&&d<=9?"辛":d>9&&d<=12?"丁":"戊";case"亥":return d>=0&&d<=12?"甲":"壬";default:return""}}
function calcNenKanshi(y,m,d){let k=((y-1873)+10)%60;if(k===0)k=60;if(m===1||(m===2&&d<SETUIRI_DATA[y][2])){k=k===1?60:k-1}return{...KANSHI_TABLE[k],id:k}}
function calcTsukiKanshi(y,m,d){const b=new Date(1873,1,1);const t=new Date(y,m-1,1);const dm=(t.getFullYear()-b.getFullYear())*12+(t.getMonth()-b.getMonth());let k=(51+dm)%60;if(k===0)k=60;if(d<SETUIRI_DATA[y][m]){k=k===1?60:k-1}return{...KANSHI_TABLE[k],id:k}}
function calcNichiKanshi(y,m,d){let kd;if(y<=1910)kd=new Date(1873,1,1);else if(y<=1950)kd=new Date(1907,11,1);else if(y<=1990)kd=new Date(1947,10,1);else if(y<=2030)kd=new Date(1987,11,1);else kd=new Date(2027,10,1);const dd=Math.floor((new Date(y,m-1,d).getTime()-kd.getTime())/86400000);let k=(21+dd)%60;if(k===0)k=60;return{...KANSHI_TABLE[k],id:k}}
function calcSyusei(nk,tk){return SYUSEI_MAP[nk]?SYUSEI_MAP[nk][tk]||"":""}
function calcZyuusei(nk,ts){return ZYUUSEI_MAP[nk]?ZYUUSEI_MAP[nk][ts]||"":""}
function calcSuurihou(nk,gk,nk2,ns,gs,nns){let c=Array(10).fill(0);[{kan:nk,shi:ns},{kan:gk,shi:gs},{kan:nk2,shi:nns}].forEach(p=>{if(KAN_INDEX[p.kan]!==undefined)c[KAN_INDEX[p.kan]]++;getZoukanAll(p.shi).forEach(h=>{if(h&&KAN_INDEX[h]!==undefined)c[KAN_INDEX[h]]++})});let t=0,bd={};["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"].forEach((k,i)=>{const pts=(SUURI_POINTS_TABLE[ns][i]+SUURI_POINTS_TABLE[gs][i]+SUURI_POINTS_TABLE[nns][i])*c[i];bd[k]=pts;t+=pts});return{total:t,breakdown:bd}}
function getBasicIsou(a,b){const t={"子":{"丑":"支合","卯":"刑","未":"害","酉":"破","午":"冲"},"丑":{"子":"支合","辰":"破","午":"害","未":"刑・冲","戌":"刑"},"寅":{"巳":"害・刑","申":"刑・冲","亥":"支合"},"卯":{"子":"刑","辰":"害","午":"破","戌":"支合","酉":"冲"},"辰":{"丑":"破","卯":"害","辰":"自刑","酉":"支合","戌":"冲"},"巳":{"寅":"害・刑","申":"合・刑","亥":"冲"},"午":{"丑":"害","卯":"破","午":"自刑","未":"支合","子":"冲"},"未":{"子":"害","丑":"刑・冲","午":"支合","戌":"刑・破"},"申":{"寅":"刑・冲","巳":"合・刑","亥":"害"},"酉":{"子":"破","辰":"支合","戌":"害","酉":"自刑","卯":"冲"},"戌":{"丑":"刑","卯":"支合","未":"刑・破","酉":"害","辰":"冲"},"亥":{"寅":"支合","申":"害","亥":"自刑","巳":"冲"}};return t[a]?(t[a][b]||""):""}
function checkNanasatsu(a,b){const p=[["甲","戊"],["乙","己"],["丙","庚"],["丁","辛"],["戊","壬"],["己","癸"],["庚","甲"],["辛","乙"],["壬","丙"],["癸","丁"]];return p.some(x=>(x[0]===a&&x[1]===b)||(x[0]===b&&x[1]===a))}
function getSpecialIsou(kA,sA,kB,sB){if(kA===kB&&sA===sB)return"律音";const opp={"子":"午","丑":"未","寅":"申","卯":"酉","辰":"戌","巳":"亥","午":"子","未":"丑","申":"寅","酉":"卯","戌":"辰","亥":"巳"};if(opp[sA]===sB){if(kA===kB)return"納音";if(checkNanasatsu(kA,kB))return"天剋地冲";return"冲"}const hk={"子":["辰","申"],"丑":["巳","酉"],"寅":["午","戌"],"卯":["未","亥"],"辰":["子","申"],"巳":["丑","酉"],"午":["寅","戌"],"未":["卯","亥"],"申":["子","辰"],"酉":["丑","巳"],"戌":["寅","午"],"亥":["卯","未"]};if(hk[sA]&&hk[sA].includes(sB))return kA===kB?"大半会":"半会";if(sA===sB)return"比和";return""}
function checkIsouhou(kA,sA,kB,sB){const sp=getSpecialIsou(kA,sA,kB,sB);const bs=getBasicIsou(sA,sB);let r=[];if(sp)r.push(sp);if(bs&&sp!==bs){bs.split(/[・/]/).forEach(b=>{if(b&&!r.includes(b))r.push(b)})}const hasC=r.some(x=>x.length>1&&x.includes("冲"));if(hasC)r=r.filter(x=>x!=="冲");return r.length>0?r.join("・"):""}

function getHachimonConfig(nk,bd){const g={moku:(bd["甲"]||0)+(bd["乙"]||0),ka:(bd["丙"]||0)+(bd["丁"]||0),d:(bd["戊"]||0)+(bd["己"]||0),gon:(bd["庚"]||0)+(bd["辛"]||0),sui:(bd["壬"]||0)+(bd["癸"]||0)};let p="";if(["甲","乙"].includes(nk))p="木";else if(["丙","丁"].includes(nk))p="火";else if(["戊","己"].includes(nk))p="土";else if(["庚","辛"].includes(nk))p="金";else if(["壬","癸"].includes(nk))p="水";switch(p){case"木":return{cL:"木",cV:g.moku,nL:"水",nV:g.sui,sL:"火",sV:g.ka,wL:"金",wV:g.gon,eL:"土",eV:g.d};case"火":return{cL:"火",cV:g.ka,nL:"木",nV:g.moku,sL:"土",sV:g.d,wL:"水",wV:g.sui,eL:"金",eV:g.gon};case"土":return{cL:"土",cV:g.d,nL:"火",nV:g.ka,sL:"金",sV:g.gon,wL:"木",wV:g.moku,eL:"水",eV:g.sui};case"金":return{cL:"金",cV:g.gon,nL:"土",nV:g.d,sL:"水",sV:g.sui,wL:"火",wV:g.ka,eL:"木",eV:g.moku};case"水":return{cL:"水",cV:g.sui,nL:"金",nV:g.gon,sL:"木",sV:g.moku,wL:"土",wV:g.d,eL:"火",eV:g.ka};default:return{}}}

function calcTaiun(y,m,d,gender,nen,tsuki,nichi){const nk=nichi.kan;const ts=nichi.tenshuu;const yang=["甲","丙","戊","庚","壬"];const isY=yang.includes(nen.kan);let isF=gender==="男性"?isY:!isY;let dd=0;const cs=SETUIRI_DATA[y][m];if(isF){if(d<cs)dd=cs-d;else{const nd=new Date(y,m,1);const ns=SETUIRI_DATA[nd.getFullYear()]?SETUIRI_DATA[nd.getFullYear()][nd.getMonth()+1]:cs;dd=(new Date(y,m,0).getDate()-d)+(ns||0)}}else{if(d>cs)dd=d-cs;else{const pd=new Date(y,m-2,1);const ps=SETUIRI_DATA[pd.getFullYear()]?SETUIRI_DATA[pd.getFullYear()][pd.getMonth()+1]:cs;dd=(new Date(pd.getFullYear(),pd.getMonth()+1,0).getDate()-(ps||0))+d}}let un=Math.round(dd/3)||1;const list=[];let ci=tsuki.id;for(let i=0;i<12;i++){ci=isF?(ci%60)+1:(ci===1?60:ci-1);const ks=KANSHI_TABLE[ci];list.push({startYear:y+un+(i*10),kanshi:ks.kan+ks.shi,syusei:calcSyusei(nk,ks.kan),zyuusei:calcZyuusei(nk,ks.shi),tenchu:ts.includes(ks.shi)?"★":"",past:checkIsouhou(ks.kan,ks.shi,nichi.kan,nichi.shi),current:checkIsouhou(ks.kan,ks.shi,tsuki.kan,tsuki.shi),future:checkIsouhou(ks.kan,ks.shi,nen.kan,nen.shi)})}return{startAge:un,direction:isF?"順回り":"逆回り",list}}

function processKantei(data){const y=parseInt(data.year),m=parseInt(data.month),d=parseInt(data.day),name=data.name||"（未入力）",gender=data.gender;if(!SETUIRI_DATA[y])return null;const nen=calcNenKanshi(y,m,d),tsuki=calcTsukiKanshi(y,m,d),nichi=calcNichiKanshi(y,m,d);const days=d-SETUIRI_DATA[y][m];const inN=getInsenPillar(nen.shi,days),inT=getInsenPillar(tsuki.shi,days),inD=getInsenPillar(nichi.shi,days);const nk=nichi.kan;const sr=calcSuurihou(nk,tsuki.kan,nen.kan,nichi.shi,tsuki.shi,nen.shi);const tai=calcTaiun(y,m,d,gender,nen,tsuki,nichi);const hm=getHachimonConfig(nk,sr.breakdown);return{name,birthday:`${y}年${m}月${d}日`,gender,nen:{k:nen.kan,s:nen.shi,id:nen.id,zoukan:inN},tsuki:{k:tsuki.kan,s:tsuki.shi,id:tsuki.id,zoukan:inT},nichi:{k:nichi.kan,s:nichi.shi,id:nichi.id,zoukan:inD},tenshuu:nichi.tenshuu,shusei:{c:calcSyusei(nk,getZoukan(tsuki.shi,days)),n:calcSyusei(nk,nen.kan),s:calcSyusei(nk,tsuki.kan),e:calcSyusei(nk,getZoukan(nen.shi,days)),w:calcSyusei(nk,getZoukan(nichi.shi,days))},zyuusei:{young:calcZyuusei(nk,nen.shi),mid:calcZyuusei(nk,tsuki.shi),old:calcZyuusei(nk,nichi.shi)},suuriTotal:sr.total,suuriBreakdown:sr.breakdown,hachimon:hm,isou:{nenGetsu:checkIsouhou(nen.kan,nen.shi,tsuki.kan,tsuki.shi),getsuNichi:checkIsouhou(tsuki.kan,tsuki.shi,nichi.kan,nichi.shi),nenNichi:checkIsouhou(nen.kan,nen.shi,nichi.kan,nichi.shi)},taiun:tai}}
function getInsenPillar(shi,days){const all=getZoukanAll(shi);const active=getZoukan(shi,days);return all.map(k=>({kan:k,isActive:k!==""&&k===active}))}

// ===== UI COMPONENTS =====
const COLORS = {
  bg: "#FAF7F2", card: "#FFFFFF", accent: "#8B6914", accentLight: "#C4A44A",
  text: "#2C2417", textLight: "#7A6E5D", border: "#E8E0D4", red: "#C0392B",
  blue: "#2E6B9E", sectionBg: "#F7F3EC", headerBg: "#2C2417"
};

const styles = {
  page: { minHeight:"100vh", background:COLORS.bg, fontFamily:"'Noto Serif JP','Hiragino Mincho ProN','MS Mincho',serif", color:COLORS.text, padding:"20px" },
  container: { maxWidth:960, margin:"0 auto" },
  inputCard: { background:COLORS.card, borderRadius:12, padding:"40px 36px", boxShadow:"0 2px 20px rgba(0,0,0,0.06)", border:`1px solid ${COLORS.border}`, marginBottom:30 },
  title: { textAlign:"center", fontSize:28, fontWeight:700, letterSpacing:6, color:COLORS.text, margin:0, paddingBottom:16, borderBottom:`2px solid ${COLORS.accent}` },
  subtitle: { textAlign:"center", fontSize:13, color:COLORS.textLight, marginTop:8, letterSpacing:2 },
  inputRow: { display:"flex", gap:16, marginTop:24, flexWrap:"wrap" },
  input: { flex:1, minWidth:120, padding:"12px 16px", border:`1px solid ${COLORS.border}`, borderRadius:8, fontSize:16, fontFamily:"inherit", background:"#FDFCFA", outline:"none" },
  select: { padding:"12px 16px", border:`1px solid ${COLORS.border}`, borderRadius:8, fontSize:16, fontFamily:"inherit", background:"#FDFCFA", minWidth:100 },
  btn: { width:"100%", marginTop:24, padding:"16px", background:`linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, color:"#fff", border:"none", borderRadius:8, fontSize:17, fontWeight:700, letterSpacing:4, cursor:"pointer", fontFamily:"inherit", transition:"opacity 0.2s" },
  resultCard: { background:COLORS.card, borderRadius:12, padding:"40px 36px", boxShadow:"0 2px 20px rgba(0,0,0,0.06)", border:`1px solid ${COLORS.border}` },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginTop:24 },
  section: { border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"24px 20px", position:"relative", background:COLORS.card },
  sectionLabel: { position:"absolute", top:-13, left:16, background:COLORS.headerBg, color:"#fff", padding:"4px 14px", borderRadius:4, fontSize:13, fontWeight:600, letterSpacing:2 },
};

function IsouLabel({ text }) {
  if (!text) return <span style={{color:COLORS.textLight, fontSize:13}}>—</span>;
  return <>{text.split("・").map((p,i)=>{
    const blue=["半会","大半会","支合","律音","合"].some(b=>p.includes(b));
    const c=blue?COLORS.blue:p.includes("比和")?COLORS.text:COLORS.red;
    return <span key={i} style={{color:c,fontWeight:600,fontSize:14}}>{i>0?" ":""}{p==="合"?"支合":p}</span>;
  })}</>;
}

function CrossCell({v,sub,style:s}){return <td style={{width:100,height:64,textAlign:"center",border:`1px solid ${COLORS.border}`,fontSize:sub?13:17,fontWeight:sub?400:600,background:COLORS.card,verticalAlign:"middle",...s}}>{v}{sub&&<div style={{fontSize:11,color:COLORS.textLight,marginTop:2}}>{sub}</div>}</td>}
function EmptyTd(){return <td style={{border:"none",background:"transparent"}}/>}

export default function SanmeiKantei() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("男性");
  const [birthday, setBirthday] = useState("1980-01-01");
  const [result, setResult] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const run = useCallback(() => {
    if (!birthday) return;
    const [y,m,d] = birthday.split("-");
    const r = processKantei({ name, year:y, month:m, day:d, gender });
    if (!r) { alert("対応範囲外の年です"); return; }
    setResult(r); setShowAll(false);
  }, [name, gender, birthday]);

  const currentYear = new Date().getFullYear();

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&display=swap" rel="stylesheet"/>
      <div style={styles.container}>
        {/* Input */}
        <div style={styles.inputCard}>
          <h1 style={styles.title}>宿 命 鑑 定 書</h1>
          <p style={styles.subtitle}>算命学・本格鑑定システム</p>
          <div style={styles.inputRow}>
            <input style={styles.input} placeholder="お名前" value={name} onChange={e=>setName(e.target.value)}/>
            <select style={styles.select} value={gender} onChange={e=>setGender(e.target.value)}>
              <option>男性</option><option>女性</option>
            </select>
            <input type="date" style={{...styles.input, minWidth:180}} value={birthday} onChange={e=>setBirthday(e.target.value)}/>
          </div>
          <button style={styles.btn} onClick={run} onMouseOver={e=>e.target.style.opacity=0.85} onMouseOut={e=>e.target.style.opacity=1}>鑑定する</button>
        </div>

        {result && (
          <div style={styles.resultCard}>
            {/* Header */}
            <h1 style={{...styles.title, fontSize:26}}>宿 命 鑑 定 書</h1>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:20,paddingBottom:14,borderBottom:`1px solid ${COLORS.border}`,flexWrap:"wrap",gap:8}}>
              <div>お名前：<span style={{fontSize:"1.3em",borderBottom:`1px solid ${COLORS.text}`,paddingBottom:2}}>{result.name}</span> 様</div>
              <div style={{color:COLORS.textLight}}>生年月日：{result.birthday}（{result.gender}）</div>
            </div>

            <div style={styles.grid2}>
              {/* 陰占 */}
              <div style={styles.section}>
                <div style={styles.sectionLabel}>陰 占</div>
                <table style={{width:"100%",borderCollapse:"collapse",textAlign:"center",marginTop:8}}>
                  <thead><tr>{["日柱","月柱","年柱"].map(h=><th key={h} style={{fontWeight:400,color:COLORS.textLight,fontSize:13,paddingBottom:10}}>{h}</th>)}</tr></thead>
                  <tbody>
                    <tr style={{fontSize:11,color:COLORS.textLight}}><td>({result.nichi.id})</td><td>({result.tsuki.id})</td><td>({result.nen.id})</td></tr>
                    <tr style={{fontSize:22}}><td>{result.nichi.k}</td><td>{result.tsuki.k}</td><td>{result.nen.k}</td></tr>
                    <tr style={{fontSize:22}}><td>{result.nichi.s}</td><td>{result.tsuki.s}</td><td>{result.nen.s}</td></tr>
                    {[0,1,2].map(i=><tr key={i} style={{height:28}}>{[result.nichi,result.tsuki,result.nen].map((p,j)=>{const z=p.zoukan[i];return <td key={j} style={{fontSize:18,fontWeight:z?.isActive?"bold":"normal",color:z?.kan?COLORS.text:"transparent"}}>{z?.kan||"　"}</td>})}</tr>)}
                    <tr><td colSpan={3} style={{paddingTop:12}}>天冲殺：<b style={{color:COLORS.red,fontSize:18}}>{result.tenshuu}</b></td></tr>
                  </tbody>
                </table>
              </div>

              {/* 陽占 */}
              <div style={styles.section}>
                <div style={styles.sectionLabel}>陽 占</div>
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:220,marginTop:8}}>
                  <table style={{borderCollapse:"collapse"}}>
                    <tbody>
                      <tr><EmptyTd/><CrossCell v={result.shusei.n}/><CrossCell v={result.zyuusei.young} sub="初年"/></tr>
                      <tr><CrossCell v={result.shusei.w}/><CrossCell v={result.shusei.c} style={{background:COLORS.sectionBg,fontWeight:700}}/><CrossCell v={result.shusei.e}/></tr>
                      <tr><CrossCell v={result.zyuusei.old} sub="晩年"/><CrossCell v={result.shusei.s}/><CrossCell v={result.zyuusei.mid} sub="中年"/></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div style={styles.grid2}>
              {/* 位相法 */}
              <div style={styles.section}>
                <div style={styles.sectionLabel}>位相法</div>
                <div style={{textAlign:"center",paddingTop:16}}>
                  <div style={{display:"flex",justifyContent:"center",gap:50,fontSize:22,fontWeight:600,marginBottom:8}}>
                    <span>{result.nichi.s}</span><span>{result.tsuki.s}</span><span>{result.nen.s}</span>
                  </div>
                  <svg width="280" height="140" viewBox="0 0 280 140" style={{display:"block",margin:"0 auto"}}>
                    {/* Upper brackets: 日支-月支 and 月支-年支 */}
                    <path d="M 46 5 V 20 H 140 V 5" fill="none" stroke="#333" strokeWidth="1.2"/>
                    <path d="M 140 5 V 20 H 234 V 5" fill="none" stroke="#333" strokeWidth="1.2"/>
                    {/* Labels for upper brackets */}
                    {result.isou.getsuNichi ? result.isou.getsuNichi.split("・").map((p,i)=>{
                      const blue=["半会","大半会","支合","律音","合"].some(b=>p.includes(b));
                      const c=blue?"#2E6B9E":p.includes("比和")?"#333":"#C0392B";
                      return <text key={"gn"+i} x="93" y={42+i*18} textAnchor="middle" fill={c} fontSize="15" fontWeight="600" fontFamily="'Noto Serif JP',serif">{p==="合"?"支合":p}</text>;
                    }) : null}
                    {result.isou.nenGetsu ? result.isou.nenGetsu.split("・").map((p,i)=>{
                      const blue=["半会","大半会","支合","律音","合"].some(b=>p.includes(b));
                      const c=blue?"#2E6B9E":p.includes("比和")?"#333":"#C0392B";
                      return <text key={"ng"+i} x="187" y={42+i*18} textAnchor="middle" fill={c} fontSize="15" fontWeight="600" fontFamily="'Noto Serif JP',serif">{p==="合"?"支合":p}</text>;
                    }) : null}
                    {/* Lower bracket: 日支-年支 */}
                    <path d="M 46 75 V 90 H 234 V 75" fill="none" stroke="#333" strokeWidth="1.2"/>
                    {result.isou.nenNichi ? result.isou.nenNichi.split("・").map((p,i)=>{
                      const blue=["半会","大半会","支合","律音","合"].some(b=>p.includes(b));
                      const c=blue?"#2E6B9E":p.includes("比和")?"#333":"#C0392B";
                      return <text key={"nn"+i} x="140" y={112+i*18} textAnchor="middle" fill={c} fontSize="15" fontWeight="600" fontFamily="'Noto Serif JP',serif">{p==="合"?"支合":p}</text>;
                    }) : null}
                  </svg>
                </div>
              </div>

              {/* 八門法・数理法 */}
              <div style={styles.section}>
                <div style={styles.sectionLabel}>八門法・数理法</div>
                <div style={{textAlign:"center",paddingTop:12}}>
                  <table style={{margin:"0 auto",borderCollapse:"collapse"}}>
                    <tbody>
                      <tr><td/><td style={{textAlign:"center",padding:6,fontSize:16}}>[ {result.hachimon.nL} ]<br/><span style={{color:COLORS.accent,fontWeight:700}}>{result.hachimon.nV}</span></td><td/></tr>
                      <tr>
                        <td style={{padding:6,fontSize:16}}>[ {result.hachimon.wL} ]<br/><span style={{color:COLORS.accent,fontWeight:700}}>{result.hachimon.wV}</span></td>
                        <td style={{padding:6,fontSize:16}}>[ {result.hachimon.cL} ]<br/><span style={{color:COLORS.accent,fontWeight:700}}>{result.hachimon.cV}</span></td>
                        <td style={{padding:6,fontSize:16}}>[ {result.hachimon.eL} ]<br/><span style={{color:COLORS.accent,fontWeight:700}}>{result.hachimon.eV}</span></td>
                      </tr>
                      <tr><td colSpan={3} style={{textAlign:"center",padding:6,fontSize:16}}>[ {result.hachimon.sL} ]<br/><span style={{color:COLORS.accent,fontWeight:700}}>{result.hachimon.sV}</span></td></tr>
                    </tbody>
                  </table>
                  <div style={{marginTop:16,fontSize:15}}>総エネルギー：<span style={{color:COLORS.accent,fontWeight:700,fontSize:20}}>{result.suuriTotal}</span> 点</div>
                  <div style={{display:"flex",justifyContent:"center",gap:4,marginTop:8,flexWrap:"nowrap"}}>
                    {["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"].map(k=>(
                      <div key={k} style={{textAlign:"center",padding:"4px 4px",background:COLORS.sectionBg,borderRadius:4,flex:"1 1 0",minWidth:0}}>
                        <div style={{fontSize:11,color:COLORS.textLight}}>{k}</div>
                        <div style={{fontSize:13,fontWeight:600}}>{result.suuriBreakdown[k]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 大運 */}
            <div style={{...styles.section,marginTop:24}}>
              <div style={styles.sectionLabel}>大 運</div>
              <div style={{marginTop:8,marginBottom:12,fontSize:15}}>立運：<b>{result.taiun.startAge}歳</b>（{result.taiun.direction}）</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <tbody>{result.taiun.list.map((t,i)=>{
                    const isCurrent = t.startYear <= currentYear && (i < result.taiun.list.length - 1 ? result.taiun.list[i+1].startYear > currentYear : true);
                    return (
                    <tr key={i} style={{borderTop:`1px solid ${COLORS.border}`,background:isCurrent?"#FFF9E6":"transparent"}}>
                      <td style={{padding:"6px",textAlign:"center",fontWeight:isCurrent?700:400}}>{t.startYear}〜</td>
                      <td style={{textAlign:"center"}}>{t.kanshi}</td>
                      <td style={{textAlign:"center"}}>{t.syusei}</td>
                      <td style={{textAlign:"center"}}>{t.zyuusei}</td>
                      <td style={{textAlign:"center",color:COLORS.red}}>{t.tenchu}</td>
                      <td style={{textAlign:"center",fontSize:11}}><IsouLabel text={t.past}/></td>
                      <td style={{textAlign:"center",fontSize:11}}><IsouLabel text={t.current}/></td>
                      <td style={{textAlign:"center",fontSize:11}}><IsouLabel text={t.future}/></td>
                    </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            </div>

            {/* 年運 */}
            <div style={{...styles.section,marginTop:24}}>
              <div style={styles.sectionLabel}>年 運</div>
              <div style={{display:"flex",justifyContent:"flex-end",marginTop:4,marginBottom:8}}>
                <button onClick={()=>setShowAll(!showAll)} style={{background:"none",border:"none",color:COLORS.blue,cursor:"pointer",fontSize:13,textDecoration:"underline",fontFamily:"inherit"}}>{showAll?"直近12年に戻す":"全年表示"}</button>
              </div>
              <div style={{maxHeight:400,overflowY:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <tbody>{(()=>{
                    // Build nenun inline
                    const list=[];for(let i=0;i<120;i++){const ty=parseInt(birthday.split("-")[0])+i;if(!SETUIRI_DATA[ty])continue;const yk=calcNenKanshi(ty,4,1);list.push({year:ty,kanshi:yk.kan+yk.shi,syusei:calcSyusei(result.nichi.k,yk.kan),zyuusei:calcZyuusei(result.nichi.k,yk.shi),tenchu:result.tenshuu.includes(yk.shi)?"★":"",past:checkIsouhou(yk.kan,yk.shi,result.nichi.k,result.nichi.s),current:checkIsouhou(yk.kan,yk.shi,result.tsuki.k,result.tsuki.s),future:checkIsouhou(yk.kan,yk.shi,result.nen.k,result.nen.s)})}
                    const filtered=showAll?list:list.filter(x=>x.year>=currentYear-1).slice(0,12);
                    return filtered.map((n,i)=>(
                      <tr key={i} style={{borderTop:`1px solid ${COLORS.border}`,background:n.year===currentYear?"#FFF9E6":"transparent"}}>
                        <td style={{padding:"6px",textAlign:"center",fontWeight:n.year===currentYear?700:400}}>{n.year}</td>
                        <td style={{textAlign:"center"}}>{n.kanshi}</td>
                        <td style={{textAlign:"center"}}>{n.syusei}</td>
                        <td style={{textAlign:"center"}}>{n.zyuusei}</td>
                        <td style={{textAlign:"center",color:COLORS.red}}>{n.tenchu}</td>
                        <td style={{textAlign:"center",fontSize:11}}><IsouLabel text={n.past}/></td>
                        <td style={{textAlign:"center",fontSize:11}}><IsouLabel text={n.current}/></td>
                        <td style={{textAlign:"center",fontSize:11}}><IsouLabel text={n.future}/></td>
                      </tr>
                    ));
                  })()}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
