function CurrentYear() {
  const currentYear = new Date().getFullYear();
  return <span className="copyright-year">{currentYear}</span>;
}

export default CurrentYear; 