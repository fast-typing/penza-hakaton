import { SyntheticEvent, useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import AdaptiveContainer from "../../../components/AdaptiveContainer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function KinoAfisha({cinemas}) {
  const [tabs, setTabs] = useState(0);

  function handleTabs(event: SyntheticEvent, newValue: string) {
    setTabs(+newValue);
  }

  function getTime(time: string): string {
    return time.toString().slice(0, 2) + ":" + time.toString().slice(2, 4);
  }

  return cinemas ? (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Tabs
        value={tabs}
        className="mb-4"
        onChange={handleTabs}
        sx={{ maxWidth: { xs: "1200px" }, width: '90vw' }}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {cinemas.map((cinema, index) => (
          <Tab label={cinema.name} value={index} />
        ))}
      </Tabs>
      <div>
        {cinemas.map((cinema, index) => (
          tabs === index ? <>
            {cinema.timetable.map((el) => (
              <div>
                <h2 className="h-fit mb-4">Расписание сеансов в кино сегодня</h2>
                <AdaptiveContainer
                  content={el.movies.map((movie) => (
                    <div className="p-2 bg-[var(--black-2)] rounded h-fit">
                      <a href={movie.movie_link} target="_blank" rel="noreferrer">
                        <img
                          className="w-full h-[300px] object-cover rounded"
                          src={movie.movie_poster}
                          alt={movie.movie_poster}
                        />
                      </a>
                      <h3 className="my-2 two-rows-text h-[54px]">{movie.movie_name}</h3>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Сеансы</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="flex flex-wrap gap-2">
                            {movie.times.map((item) =>
                              item.order_link?.length ? (
                                <a href={item.order_link} target="_blank" rel="noreferrer">
                                  <Chip disabled={!item.order_link?.length} label={getTime(item.time)} />
                                </a>
                              ) : (
                                <Tooltip arrow placement="top" title="недоступно" >
                                  <a href={item.order_link} target="_blank" rel="noreferrer">
                                    <Chip disabled={!item.order_link?.length} label={getTime(item.time)} />
                                  </a>
                                </Tooltip>
                              )
                            )}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  ))}
                />
              </div>
            ))}
          </> : null
        ))}
      </div>
      <p className="opacity-50 mt-8">
        Вся информация взята с api{" "}
        <a href="https://www.kinoafisha.info/" className="underline">
          киноафиши
        </a>
      </p>
    </Box>
  ) : null;
}
