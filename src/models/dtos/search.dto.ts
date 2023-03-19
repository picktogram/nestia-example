export interface SearchDto {
  /**
   * 검색하고자 하는 키워드, 또는 문장일 수도 있다
   * @maxLength 200
   */
  search?: string;
}
