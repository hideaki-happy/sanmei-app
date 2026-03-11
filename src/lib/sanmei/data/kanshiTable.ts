import type { KanshiEntry } from "@/types/sanmei";

// 干支テーブル（1〜60番）。0番はnull
export const KANSHI_TABLE: (KanshiEntry | null)[] = [
  null,
  {kan:"甲",shi:"子",tenshuu:"戌亥",id:1},{kan:"乙",shi:"丑",tenshuu:"戌亥",id:2},{kan:"丙",shi:"寅",tenshuu:"戌亥",id:3},{kan:"丁",shi:"卯",tenshuu:"戌亥",id:4},{kan:"戊",shi:"辰",tenshuu:"戌亥",id:5},{kan:"己",shi:"巳",tenshuu:"戌亥",id:6},{kan:"庚",shi:"午",tenshuu:"戌亥",id:7},{kan:"辛",shi:"未",tenshuu:"戌亥",id:8},{kan:"壬",shi:"申",tenshuu:"戌亥",id:9},{kan:"癸",shi:"酉",tenshuu:"戌亥",id:10},
  {kan:"甲",shi:"戌",tenshuu:"申酉",id:11},{kan:"乙",shi:"亥",tenshuu:"申酉",id:12},{kan:"丙",shi:"子",tenshuu:"申酉",id:13},{kan:"丁",shi:"丑",tenshuu:"申酉",id:14},{kan:"戊",shi:"寅",tenshuu:"申酉",id:15},{kan:"己",shi:"卯",tenshuu:"申酉",id:16},{kan:"庚",shi:"辰",tenshuu:"申酉",id:17},{kan:"辛",shi:"巳",tenshuu:"申酉",id:18},{kan:"壬",shi:"午",tenshuu:"申酉",id:19},{kan:"癸",shi:"未",tenshuu:"申酉",id:20},
  {kan:"甲",shi:"申",tenshuu:"午未",id:21},{kan:"乙",shi:"酉",tenshuu:"午未",id:22},{kan:"丙",shi:"戌",tenshuu:"午未",id:23},{kan:"丁",shi:"亥",tenshuu:"午未",id:24},{kan:"戊",shi:"子",tenshuu:"午未",id:25},{kan:"己",shi:"丑",tenshuu:"午未",id:26},{kan:"庚",shi:"寅",tenshuu:"午未",id:27},{kan:"辛",shi:"卯",tenshuu:"午未",id:28},{kan:"壬",shi:"辰",tenshuu:"午未",id:29},{kan:"癸",shi:"巳",tenshuu:"午未",id:30},
  {kan:"甲",shi:"午",tenshuu:"辰巳",id:31},{kan:"乙",shi:"未",tenshuu:"辰巳",id:32},{kan:"丙",shi:"申",tenshuu:"辰巳",id:33},{kan:"丁",shi:"酉",tenshuu:"辰巳",id:34},{kan:"戊",shi:"戌",tenshuu:"辰巳",id:35},{kan:"己",shi:"亥",tenshuu:"辰巳",id:36},{kan:"庚",shi:"子",tenshuu:"辰巳",id:37},{kan:"辛",shi:"丑",tenshuu:"辰巳",id:38},{kan:"壬",shi:"寅",tenshuu:"辰巳",id:39},{kan:"癸",shi:"卯",tenshuu:"辰巳",id:40},
  {kan:"甲",shi:"辰",tenshuu:"寅卯",id:41},{kan:"乙",shi:"巳",tenshuu:"寅卯",id:42},{kan:"丙",shi:"午",tenshuu:"寅卯",id:43},{kan:"丁",shi:"未",tenshuu:"寅卯",id:44},{kan:"戊",shi:"申",tenshuu:"寅卯",id:45},{kan:"己",shi:"酉",tenshuu:"寅卯",id:46},{kan:"庚",shi:"戌",tenshuu:"寅卯",id:47},{kan:"辛",shi:"亥",tenshuu:"寅卯",id:48},{kan:"壬",shi:"子",tenshuu:"寅卯",id:49},{kan:"癸",shi:"丑",tenshuu:"寅卯",id:50},
  {kan:"甲",shi:"寅",tenshuu:"子丑",id:51},{kan:"乙",shi:"卯",tenshuu:"子丑",id:52},{kan:"丙",shi:"辰",tenshuu:"子丑",id:53},{kan:"丁",shi:"巳",tenshuu:"子丑",id:54},{kan:"戊",shi:"午",tenshuu:"子丑",id:55},{kan:"己",shi:"未",tenshuu:"子丑",id:56},{kan:"庚",shi:"申",tenshuu:"子丑",id:57},{kan:"辛",shi:"酉",tenshuu:"子丑",id:58},{kan:"壬",shi:"戌",tenshuu:"子丑",id:59},{kan:"癸",shi:"亥",tenshuu:"子丑",id:60},
];
